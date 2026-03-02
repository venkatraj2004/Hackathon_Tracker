package com.demo.hackathon_tracker_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.hackathon_tracker_backend.entity.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {
	
}