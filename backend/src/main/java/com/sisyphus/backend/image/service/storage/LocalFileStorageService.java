package com.sisyphus.backend.image.service.storage;

import com.sisyphus.backend.configuration.AppProps;
import com.sisyphus.backend.configuration.FileProps;
import com.sisyphus.backend.image.service.ImageUrlFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LocalFileStorageService implements FileStorageService {

    private final FileProps fileProps;          // file.upload-dir / file.access-url-prefix(미사용)
    private final ImageUrlFactory urlFactory;   // app.image.public-base(예: https://img.example.com/uploads)
    private final AppProps appProps;            // (선택) app.upload.allowed-extensions 화이트리스트

    @Override
    public String save(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어 있습니다.");
        }

        try {
            // 업로드 루트 디렉터리 보장
            Path root = Path.of(fileProps.uploadDir()).toAbsolutePath().normalize();
            Files.createDirectories(root);

            // Content-Type → 확장자 (원본 파일명 신뢰 X)
            String ext = extOf(file).toLowerCase();

            // (선택) 화이트리스트 검증 – app.upload.allowed-extensions
            List<String> allowed = appProps.upload().allowedExtensions();
            if (allowed != null && !allowed.isEmpty() && !allowed.contains(ext)) {
                throw new IllegalArgumentException("허용되지 않은 확장자: " + ext);
            }

            // 파일명 생성 및 저장
            String savedName = UUID.randomUUID() + "." + ext;
            Path dest = root.resolve(savedName).normalize();

            // 디렉터리 트래버슬 방지
            if (!dest.startsWith(root)) {
                throw new SecurityException("잘못된 경로 접근");
            }

            file.transferTo(dest.toFile());

            // Nginx 정적 서빙 기준: 공개 URL은 베이스 + 파일명
            return urlFactory.publicUrl(savedName);

        } catch (IOException e) {
            throw new RuntimeException("파일 저장 실패", e);
        }
    }

    @Override
    public void delete(String savedUrl) {
        try {
            // savedUrl이 전체 URL일 수도, 파일명만 올 수도 있음 → 마지막 path segment만 추출
            String filename = extractFileName(savedUrl);
            if (filename == null || filename.isBlank()) return;

            Path root = Path.of(fileProps.uploadDir()).toAbsolutePath().normalize();
            Path target = root.resolve(filename).normalize();

            // 안전 체크
            if (!target.startsWith(root)) return;

            Files.deleteIfExists(target);
        } catch (IOException e) {
            throw new RuntimeException("파일 삭제 실패", e);
        }
    }

    /** savedUrl이 전체 URL이어도 마지막 세그먼트(파일명)만 뽑아낸다. */
    private static String extractFileName(String savedUrl) {
        try {
            String path = URI.create(savedUrl).getPath(); // /uploads/xxxx.png
            if (path == null) return null;
            int idx = path.lastIndexOf('/');
            return (idx >= 0) ? path.substring(idx + 1) : path;
        } catch (Exception ignore) {
            // URL 파싱 실패 시 단순 분해
            int idx = savedUrl.lastIndexOf('/');
            return (idx >= 0) ? savedUrl.substring(idx + 1) : savedUrl;
        }
    }

    /** Content-Type 기반 확장자 결정 (원본 파일명 신뢰하지 않음) */
    private static String extOf(MultipartFile f) {
        String ct = Objects.requireNonNull(f.getContentType(), "Content-Type 누락");
        return switch (ct) {
            case "image/png"  -> "png";
            case "image/jpeg" -> "jpg";
            case "image/webp" -> "webp";
            case "image/gif"  -> "gif";
            default -> throw new IllegalArgumentException("지원하지 않는 이미지 타입: " + ct);
        };
    }
}
