package com.happypour.happypour;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(properties = "jwt.secret=test-secret")
class HappypourApplicationTests {

	@Test
	void contextLoads() {
	}

}
