package com.happypour.happypour.service;

import com.happypour.happypour.dto.*;
import com.happypour.happypour.model.*;
import com.happypour.happypour.repository.BarRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.beans.BeanUtils;

import java.util.List;
import java.util.Optional;

@Service
public class BarService {

    @Autowired
    private BarRepository barRepository;
    @Autowired
    UserService userService;

    public List<Bar> getAll() {
        return barRepository.findAll();
    }

    public Bar getById(Long id) {
        return barRepository.findById(id).orElse(null);
    }

    public BarDTO createBar(BarDTO barDTO) {
        User user = userService.getById(barDTO.getCreatorId());
        if(user == null) throw new IllegalArgumentException("No user with id " + barDTO.getCreatorId() + " found.");

        Bar bar = Bar.builder()
            .id(null)
            .name(barDTO.getName())
            .address(barDTO.getAddress())
            .coordLat(barDTO.getCoordLat())
            .coordLong(barDTO.getCoordLong())
            .openFrom(java.time.LocalTime.parse(barDTO.getOpenFrom()))
            .openTo(java.time.LocalTime.parse(barDTO.getOpenTo()))
            .cloakroomFee(0)
            .entryFee(0)
            .createdBy(user)
            .updatedBy(user)
            .build();
        Bar createdBar = barRepository.save(bar);
        return new BarDTO(createdBar);
    }

    public BarDTO updateBar(Long barId, BarDTO barDTO) {
        Optional<Bar> existingBar = barRepository.findById(barId);
        if (existingBar.isPresent()) {
            BeanUtils.copyProperties(barDTO, existingBar.get(), "id", "createdBy", "createdAt");
            Bar updatedBar = barRepository.save(existingBar.get());
            return new BarDTO(updatedBar);
        }
        return null;
    }

    public void removeBar(Long id) {
        if(barRepository.existsById(id)) {
            try {
                barRepository.deleteById(id);

            } catch (Exception e) {
                throw new RuntimeException("Error deleting bar with id " + id);
            }
        } else {
            throw new IllegalArgumentException("No bar with id " + id + " found.");
        }
    }
}