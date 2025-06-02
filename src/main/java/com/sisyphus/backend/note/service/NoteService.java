package com.sisyphus.backend.note.service;


import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.repository.UserRepository;
import com.sisyphus.backend.note.dto.WordRequest;
import com.sisyphus.backend.note.dto.WordResponse;
import com.sisyphus.backend.note.entity.Word;
import com.sisyphus.backend.note.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WordService {

    private final WordRepository wordRepository;
    private final UserRepository userRepository;


    public WordResponse createWord(WordRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Word word = new Word(user, request.getWordText(), request.getMeaning(), request.getSource());
        wordRepository.save(word);

        return WordResponse.fromEntity(word);
    }

    public List<WordResponse> getAllWords(Long userId) {
        return wordRepository.findAllByUserId(userId)
                .stream()
                .map(WordResponse::fromEntity)
                .toList();
    }

    public void deleteWord(Long wordId, Long userId) {
        Word word = wordRepository.findByIdAndUserId(wordId, userId)
                .orElseThrow(() -> new RuntimeException("단어가 존재하지 않거나 권한이 없습니다."));
        wordRepository.delete(word);
    }
}
