package com.happypour.happypour.service;

import com.happypour.happypour.dto.HappyHourDTO;
import com.happypour.happypour.entity.*;
import com.happypour.happypour.mapper.HappyHourMapper;
import com.happypour.happypour.repository.HappyHourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class HappyHourService {

    @Autowired
    HappyHourRepository happyHourRepository;

    @Autowired
    BarService barService;

    @Autowired
    UserService userService;

    public List<HappyHour> getAll() {
        return happyHourRepository.findAll();
    }
    protected HappyHour getById(Long id) {
        return happyHourRepository.findById(id).orElse(null);
    }
    protected List<HappyHour> getByBarId(Long barId) {
        return happyHourRepository.findByBarId(barId);
    }
    /**
     * Finds and returns a DTO of a Happy Hour with given id.
     * @param id
     * @return Happy Hour with matching id as a DTO.
     */
    public HappyHourDTO getHappyHourDTOById(Long id) {
        Optional<HappyHour> happyHour = happyHourRepository.findById(id);
        if(happyHour.isEmpty()) 
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Happy hour with id "+id+" not found");
        
        return HappyHourMapper.toDTO(happyHour.get(), null);
    }
    /**
     * Fetches all Happy Hours with given bar id.
     * @param barId Bar's id
     * @return List of Happy Hour DTOs associated with given bar id.
     */
    public List<HappyHourDTO> getDTOsByBarId(Long barId) {
        List<HappyHour> happyHours = happyHourRepository.findByBarId(barId);
        if(happyHours.isEmpty()) 
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Happy hours for bar id "+ barId +" not found");

        List<HappyHourDTO> happyHourDTOs = new ArrayList<>();
        happyHours.forEach(hh -> happyHourDTOs.add(HappyHourMapper.toDTO(hh, null)));
        return happyHourDTOs;
    }
    
    /**
     * Takes a HappyHour DTO, maps and saves it as an entity to database. 
     * Then returns a DTO of saved entity.
     * @param dto
     * @return DTO of saved HappyHour entity
     */
    public HappyHourDTO createHappyHour(HappyHourDTO dto) {
        if (dto.getCreatorId() == null) 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Creator id not provided");
        
        Bar bar = barService.getById(dto.getBarId());
        if(bar == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bar not found");
        
        User user = userService.getById(dto.getCreatorId());
        if(user == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"User with id "+dto.getCreatorId()+" not found");
        
        HappyHour happyHour = HappyHourMapper.toEntity(dto, bar, user);
        HappyHour created = happyHourRepository.save(happyHour);
        return HappyHourMapper.toDTO(created, null);
    }
    
    /**
     * Updates Start time, end time and weekdays of happy hour. 
     * @param id Id of Happy Hour to be updated
     * @param dto DTO of Happy Hour with updated information
     * @return DTO of updated Happy Hour
     */
    public HappyHourDTO updateHappyHour(Long id, HappyHourDTO dto) {
        if(dto.getCreatorId() == null) 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Creator id not provided");
        
        Optional<HappyHour> existingHappyHour = happyHourRepository.findById(id);
        if(existingHappyHour.isEmpty()) 
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Happy hour with id "+ id +" not found");

        HappyHour existing = existingHappyHour.get();
        
        // Map simple fields from DTO -> entity (only allowed/meaningful fields)
        if (dto.getStartTime() != null) {
            existing.setStartTime(dto.getStartTime());
        }
        if (dto.getEndTime() != null) {
            existing.setEndTime(dto.getEndTime());
        }
        if (dto.getWeekDays() != null) {
            existing.setWeekDays(dto.getWeekDays());
        }
        User updater = userService.getById(dto.getCreatorId());
        if (updater == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        
        existing.setUpdatedBy(updater);
        HappyHour updated = happyHourRepository.save(existing);
        return HappyHourMapper.toDTO(updated, null);
    }
    
    /**
     * Deletes Happy Hour with given Id. 
     * @param id
     */
    public void deleteHappyHour(Long id) {
        if(!happyHourRepository.existsById(id)) 
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Happy hour with id "+id+" not found");
        happyHourRepository.deleteById(id);
    }
}
