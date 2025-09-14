package com.theknicks.voteranalysis_backend;

import org.springframework.jdbc.core.JdbcTemplate;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class VoteranalysisBackendApplicationTests {

	@Test
	void dummyTest() {
		// Arrange
	 	JdbcTemplate jdbcTemplate = Mockito.mock(JdbcTemplate.class);
		DummyController _dummyController = new DummyController(jdbcTemplate);
		
		// Act
		var result = _dummyController.handleTest1();

		// Assert
		assertNotNull(result);
		assertEquals(result, "<h1>Hello</h1>");
	}
}
