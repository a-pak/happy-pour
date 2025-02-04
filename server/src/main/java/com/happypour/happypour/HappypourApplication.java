package com.happypour.happypour;

import com.happypour.happypour.model.User;
import com.happypour.happypour.repository.UserRepository;
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
    public CommandLineRunner demo(BarRepository barRepository, UserRepository user) {
        return (args) -> {
            User user1 = new User(null, "admin", "salasana", "admin@example.com");
            User user2 = new User(null, "moderator", "salasana", "moderator@example.com");

            user.save(user1);
            user.save(user2);

            barRepository.save(new Bar(null, "Bar Helsinki", 24.9384, 60.1699, "Mannerheimintie 1", user1, user2, null, null));
            barRepository.save(new Bar(null, "Bar Tampere", 23.7610, 61.4978, "Hämeenkatu 10", user2, user1, null, null));
            barRepository.save(new Bar(null, "Bar Turku", 22.2666, 60.4518, "Aurakatu 5", user1, user1, null, null));
            barRepository.save(new Bar(null, "Bar Oulu", 25.4666, 65.0124, "Rotuaari 3", user2, user2, null, null));

            barRepository.findAll().forEach(bar -> System.out.println(bar));
        };
    }
}
