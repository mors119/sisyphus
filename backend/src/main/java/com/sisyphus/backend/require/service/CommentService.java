//package com.sisyphus.backend.require.service;
//
//import com.sisyphus.backend.require.dto.CommentRequest;
//import com.sisyphus.backend.require.dto.CommentResponse;
//import com.sisyphus.backend.require.entity.Comment;
//import com.sisyphus.backend.require.entity.Require;
//import com.sisyphus.backend.require.repository.CommentRepository;
//import com.sisyphus.backend.require.repository.RequireRepository;
//import com.sisyphus.backend.user.service.UserService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.nio.file.AccessDeniedException;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class CommentService {
//
//    private final RequireRepository requireRepository;
//    private final CommentRepository commentRepository;
//    private final UserService userService;
//
//    public CommentResponse create(Long userId, Long requireId, CommentRequest dto) {
//        Require require = requireRepository.findById(requireId)
//                .orElseThrow(() -> new IllegalArgumentException("요청이 존재하지 않습니다."));
//
//        Comment comment = Comment.builder()
//                .userId(userId)
//                .content(dto.getContent())
//                .require(require)
//                .build();
//
//        return toDto(commentRepository.save(comment));
//    }
//
//    public List<CommentResponse> getCommentsByRequireId(Long requireId) {
//        return commentRepository.findByRequireId(requireId).stream()
//                .map(this::toDto)
//                .collect(Collectors.toList());
//    }
//
//    public void delete(Long commentId, Long userId) throws AccessDeniedException {
//        Comment comment = commentRepository.findById(commentId)
//                .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다."));
//
//        if (!comment.getUserId().equals(userId)) {
//            throw new AccessDeniedException("삭제 권한이 없습니다.");
//        }
//        commentRepository.delete(comment);
//    }
//
//    public CommentResponse toDto(Comment comment) {
//
//        String email = userService.findById(comment.getUserId()).getEmail();
//        return CommentResponse.builder()
//                .id(comment.getId())
//                .content(comment.getContent())
//                .userEmail(email)
//                .createdAt(comment.getCreatedAt())
//                .build();
//    }
//}
