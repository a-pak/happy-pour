package com.happypour.happypour;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.happypour.happypour.model.Bar;
import com.happypour.happypour.repository.BarRepository;

@SpringBootApplication
public class HappypourApplication{

	@Autowired
	private BarRepository barRepository;

	public static void main(String[] args) {
		SpringApplication.run(HappypourApplication.class, args);
	}

	// Voit käyttää CommandLineRunnerin avulla testidatan lisäämistä
    @Bean
    public CommandLineRunner demo(BarRepository repository) {
        return (args) -> {
            // Lisää testidataa
            repository.save(new Bar(null, "Bar Helsinki", 24.9384, 60.1699, "Mannerheimintie 1", 5.50, 7.20, 3.00, 10.00, 2.50));
            repository.save(new Bar(null, "The Kallio Pub", 24.9484, 60.1799, "Pasilantie 2", 6.00, 8.00, 3.50, 8.00, 3.00));
            repository.save(new Bar(null, "Riverside Bar", 24.9334, 60.1649, "Itämerenkatu 3", 5.80, 7.50, 4.00, 12.00, 3.00));

            // Tulosta kaikki baarit
            repository.findAll().forEach(bar -> System.out.println(bar));
        };
    }

}
