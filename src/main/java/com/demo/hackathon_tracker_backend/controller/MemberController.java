package com.demo.hackathon_tracker_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.demo.hackathon_tracker_backend.entity.Member;
import com.demo.hackathon_tracker_backend.repository.MemberRepository;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
public class MemberController {

   @Autowired
   private MemberRepository memberRepository;

   @GetMapping
   public List<Member> getAllMembers() {
      return memberRepository.findAll();
   }
}
