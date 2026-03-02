package com.demo.hackathon_tracker_backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.hackathon_tracker_backend.entity.Team;

public interface TeamRepository extends JpaRepository<Team, Long> {
}