package com.sisyphus.backend.image.service.storage;

import com.sisyphus.backend.global.props.AppProps;
import com.sisyphus.backend.global.props.FileProps;
import com.sisyphus.backend.image.service.ImageUrlFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RequiredArgsConstructor
public class LocalFileStorageService implements FileStorageService {

    private final FileProps fileProps;          // role: upload-dir, type: FileProps
    private final ImageUrlFactory urlFactory;   // role: public URL 생성, type: ImageUrlFactory
    private final AppProps appProps;            // role: whitelist/extensions 등, type: AppProps

    @Override
    public String save(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어 있습니다.");
        }

        // contentType은 MultipartFile에서 가져오고, originalFilename은 그대로 전달
        String contentType = Objects.requireNonNull(file.getContentType(), "Content-Type 누락");
        String originalFilename = Objects.requireNonNull(file.getOriginalFilename(), "Original filename 누락");

        try (InputStream in = file.getInputStream()) {
            return save(in, file.getSize(), contentType, originalFilename);
        } catch (IOException e) {
            throw new RuntimeException("파일 읽기 실패", e);
        }
    }

    @Override
    public String save(InputStream input, long size, String contentType, String originalFilename) {
        if (input == null) throw new IllegalArgumentException("input stream이 null 입니다.");
        if (size <= 0) throw new IllegalArgumentException("size가 0 이하입니다.");
        if (contentType == null || contentType.isBlank()) throw new IllegalArgumentException("Content-Type 누락");
        if (originalFilename == null || originalFilename.isBlank()) throw new IllegalArgumentException("originalFilename 누락");

        // 1) 확장자 결정 (Content-Type 우선)
        String ext = extOf(contentType, originalFilename).toLowerCase();

        // 2) (선택) 화이트리스트 검증
        List<String> allowed = appProps.upload().allowedExtensions();
        if (allowed != null && !allowed.isEmpty() && !allowed.contains(ext)) {
            throw new IllegalArgumentException("허용되지 않은 확장자: " + ext);
        }

        // 3) 날짜 폴더(예: 2025/12) + 파일명 생성
        LocalDate today = LocalDate.now();
        String year = String.valueOf(today.getYear());
        String month = String.format("%02d", today.getMonthValue());

        String savedName = UUID.randomUUID() + "." + ext;

        // 상대 경로: 2025/12/uuid.webp
        String relativePath = year + "/" + month + "/" + savedName;

        // 실제 저장 경로: uploadDir/2025/12/uuid.webp
        Path root = Path.of(fileProps.uploadDir()).toAbsolutePath().normalize();
        Path dest = root.resolve(relativePath).normalize();

        // 4) 안전 체크 (디렉터리 트래버슬 방지)
        if (!dest.startsWith(root)) {
            throw new SecurityException("잘못된 경로 접근");
        }

        try {
            Path parent = dest.getParent();
            if (parent != null) {
                Files.createDirectories(parent);
            }

            Files.copy(input, dest);

            // 7) 공개 URL: publicBase + "/2025/12/uuid.webp"
            return urlFactory.publicUrl(relativePath);

        } catch (IOException e) {
            throw new RuntimeException("파일 저장 실패", e);
        }
    }

    @Override
    public void delete(String publicUrlOrFilename) {
        try {
            String relativePathOrFilename = extractRelativePathOrFilename(publicUrlOrFilename);
            if (relativePathOrFilename == null || relativePathOrFilename.isBlank()) return;

            Path root = Path.of(fileProps.uploadDir()).toAbsolutePath().normalize();
            Path target = root.resolve(relativePathOrFilename).normalize();

            if (!target.startsWith(root)) return;

            Files.deleteIfExists(target);

            // (선택) 폴더 정리까지 하고 싶으면 여기서 빈 폴더 제거 로직 추가 가능
        } catch (IOException e) {
            throw new RuntimeException("파일 삭제 실패", e);
        }
    }

    /**
     * public URL이든(/uploads/images/2025/12/xxx.webp) 전체 URL이든 마지막 path 기반으로
     * "2025/12/xxx.webp" 또는 "xxx.webp" 형태를 최대한 보존해서 뽑아낸다.
     *
     * @param publicUrlOrFilename String (role: public URL 또는 filename, type: String)
     * @return String (role: 상대경로 또는 filename, type: String)
     */
    private static String extractRelativePathOrFilename(String publicUrlOrFilename) {
        if (publicUrlOrFilename == null || publicUrlOrFilename.isBlank()) return null;

        // URL이면 path 추출
        try {
            String path = URI.create(publicUrlOrFilename).getPath(); // 예: /uploads/images/2025/12/x.webp
            if (path == null || path.isBlank()) return null;

            // 여기서는 "마지막 3~4 세그먼트만 유지" 같은 룰을 강제하지 않고,
            // 운영에서는 PublicUrlPathResolver(공용 유틸)로 정확히 relativePath를 추출하는 게 더 안정적.
            // 지금은 로컬 delete 안전 목적이라 단순화.

            // 선행 / 제거
            if (path.startsWith("/")) path = path.substring(1);

            // /uploads/images/... 처럼 앞 prefix가 붙어 있을 수 있으므로,
            // 가장 안전한 방법은 "파일명만"이 아니라 "연/월/파일" 구조까지 유지하도록 찾는 것.
            // 여기서는 path 전체를 반환(후속에서 root.resolve로 안전 체크).
            return path;

        } catch (Exception ignore) {
            // URL 파싱 실패면 그냥 문자열을 반환
            return publicUrlOrFilename;
        }
    }

    /**
     * Content-Type 기반 확장자 결정 (원본 파일명은 fallback)
     *
     * @param contentType String (role: MIME type, type: String)
     * @param originalFilename String (role: 원본 파일명, type: String)
     * @return String (role: 확장자, type: String)
     */
    private static String extOf(String contentType, String originalFilename) {
        return switch (contentType) {
            case "image/png"  -> "png";
            case "image/jpeg" -> "jpg";
            case "image/webp" -> "webp";
            case "image/gif"  -> "gif";
            default -> {
                // fallback: 파일명에서 확장자 추출
                int idx = originalFilename.lastIndexOf('.');
                if (idx < 0 || idx == originalFilename.length() - 1) {
                    throw new IllegalArgumentException("지원하지 않는 이미지 타입: " + contentType);
                }
                yield originalFilename.substring(idx + 1).toLowerCase();
            }
        };
    }
}
