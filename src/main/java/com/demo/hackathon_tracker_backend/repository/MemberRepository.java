package com.demo.hackathon_tracker_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.demo.hackathon_tracker_backend.entity.Member;
import java.util.List;

public interface MemberRepository extends JpaRepository<Member, Long> {

    List<Member> findByTeamIsNull();  // For dropdown
}