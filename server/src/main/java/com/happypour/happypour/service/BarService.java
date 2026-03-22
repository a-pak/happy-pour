package com.happypour.happypour.service;

import com.happypour.happypour.dto.*;
import com.happypour.happypour.entity.*;
import com.happypour.happypour.mapper.BarMapper;
import com.happypour.happypour.repository.BarRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
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

    /**
     * Fetches Bars with coordinates within a certain area from given coordinates.
     * @param lat latitude degrees
     * @param lon longitude degrees
     * @return List of Bar entities.
     */
    public List<Bar> getByLocation(double lat, double lon) {
        System.out.println("3. BARSERVICE: Fetching bars near lat: " + lat + ", lon: " + lon);
        List<Bar> bars = barRepository.findByLocation(lat, lon);
        if(bars.isEmpty()) throw new ResponseStatusException(
            HttpStatus.NOT_FOUND, 
            "No bars found near the provided location."
        );
        System.out.println("After!!");
        return bars;
    }

    public Bar getById(Long id) {
        return barRepository.findById(id).orElse(null);
    }

    public BarDTO createBar(BarDTO barDTO) {
        if(barDTO.getCreatorId() == null) 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Creator id not provided");

        User user = userService.getById(barDTO.getCreatorId());
        if(user == null) throw new ResponseStatusException(
            HttpStatus.NOT_FOUND, 
            "No user with id " + barDTO.getCreatorId() + " found."
        );

        Bar bar = BarMapper.toEntity(barDTO, user);
        Bar createdBar = barRepository.save(bar);

        // Return DTO of created bar to client
        return BarMapper.toDTO(createdBar);
    }

    public BarDTO updateBar(Long barId, BarDTO barDTO) {
        if(barDTO.getCreatorId() == null) 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Creator id not provided");

        User user = userService.getById(barDTO.getCreatorId());
        if(user == null) 
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No user with id " +barDTO.getCreatorId()+ " found.");

        Bar newBar = BarMapper.toEntity(barDTO, user);
        Optional<Bar> existingBar = barRepository.findById(barId);

        if (existingBar.isPresent()) {
            BeanUtils.copyProperties(newBar, existingBar.get(), "id", "createdBy", "createdAt");
            Bar updatedBar = barRepository.save(existingBar.get());
            return BarMapper.toDTO(updatedBar);
        
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bar with id "+barId+" not found.");
        }
    }

    public void removeBar(Long id) {
        if(barRepository.existsById(id)) {
            barRepository.deleteById(id);     
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bar with id "+id+" not found.");
        }
    }

    
}