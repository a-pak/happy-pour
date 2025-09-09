package com.happypour.happypour.controller;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
public class GeocodeProxyController {

    private final RestTemplate restTemplate = new RestTemplate();
    /**
     * Proxy endpoint for reverse geocoding using Nominatim
     * Example request: /api/reverse-geocode?lat=60.192059&lon=24.945831
     * This endpoint forwards the request to Nominatim and returns the response.
     */
    @GetMapping("/reverse-geocode")
    public ResponseEntity<?> reverseGeocode(@RequestParam double lat, @RequestParam double lon) {
        String url = String.format(
            "https://nominatim.openstreetmap.org/reverse?lat=%f&lon=%f&format=json",
            lat, lon
        );

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "HappyPour/1.0"); // Required by Nominatim
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("Error fetching data from Nominatim");
        }
    }
}
