package com.demo.hackathon_tracker_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.demo.hackathon_tracker_backend.entity.Member;
import com.demo.hackathon_tracker_backend.entity.Team;
import com.demo.hackathon_tracker_backend.service.TeamService;
import com.demo.hackathon_tracker_backend.dto.MarkRequest;
@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "*")
public class TeamController {

    @Autowired
    private TeamService teamService;

    @PostMapping("/register")
    public Team registerTeam(@RequestBody List<Long> membersIds) {
        return teamService.registerTeam(membersIds);
    }

    @GetMapping
    public List<Team> getAllTeams() {
        return teamService.getAllTeams();
    }
    @PostMapping("/{teamId}/sprints/{sprintNo}")
    public String submitMarks(
            @PathVariable Long teamId,
            @PathVariable int sprintNo,
            @RequestBody MarkRequest request) {

        teamService.submitSprintMarks(teamId, sprintNo, request.getMarks());
        return "Marks submitted successfully";
    }
    @GetMapping("/leaderboard")
    public List<Team> getLeaderboard() {
        return teamService.getAllTeams()
                .stream()
                .sorted((a, b) -> Integer.compare(a.getRank(), b.getRank()))
                .toList();
    }
}