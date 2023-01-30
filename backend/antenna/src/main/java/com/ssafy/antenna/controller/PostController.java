package com.ssafy.antenna.controller;

import com.ssafy.antenna.domain.ResultResponse;
import com.ssafy.antenna.domain.comment.PostCommentReq;
import com.ssafy.antenna.domain.post.dto.PostDetailRes;
import com.ssafy.antenna.domain.post.dto.PostUpdateReq;
import com.ssafy.antenna.repository.PostRepository;
import com.ssafy.antenna.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/posts")
public class PostController {
    private final PostService postService;

    @PostMapping
    public ResultResponse<String> createPost(
            @RequestPart String title,
            @RequestPart String content,
            @RequestPart String lat,
            @RequestPart String lng,
            @RequestPart String isPublic,
            @RequestPart(required = false) MultipartFile file,
            Authentication authentication
    ) throws IOException {
        return ResultResponse.success(
                postService.createPost(
                        Long.valueOf(authentication.getName()),
                        title,
                        content,
                        lat,
                        lng,
                        isPublic,
                        file
                )
        );
    }

    @DeleteMapping("/{postId}")
    public ResultResponse<String> deletePost(
            @PathVariable Long postId,
            Authentication authentication
    ) throws IllegalAccessException {
        return ResultResponse.success(
                postService.deletePost(
                        Long.valueOf(authentication.getName()),
                        postId
                )
        );
    }

    @GetMapping("/{postId}/photo")
    public ResponseEntity<?> getPostPhoto(@PathVariable Long postId) {
        return postService.getPostPhoto(postId);
    }

    @PutMapping("/{postId}")
    public  ResultResponse<?> updatePost(
            @PathVariable Long postId,
            @RequestBody PostUpdateReq postUpdateReq,
            Authentication authentication
    ) throws IllegalAccessException {
        return postService.updatePost(postId, postUpdateReq, authentication);
    }

    @PostMapping("{postId}/comments")
    public ResultResponse<?> postComment(
            @PathVariable Long postId,
            @RequestBody PostCommentReq postCommentReq,
            Authentication authentication
    ) {
        return postService.postComment(
                postId,
                postCommentReq,
                Long.valueOf(authentication.getName())
        );
    }

    @GetMapping
    public ResultResponse<List<PostDetailRes>> getPostWithArea(@RequestParam double lng, @RequestParam double lat, @RequestParam double area){
        return ResultResponse.success(postService.getPostWithArea(lng,lat,area));
    }
}
