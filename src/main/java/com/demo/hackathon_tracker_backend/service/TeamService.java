package com.demo.hackathon_tracker_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demo.hackathon_tracker_backend.entity.Member;
import com.demo.hackathon_tracker_backend.entity.Team;
import com.demo.hackathon_tracker_backend.repository.TeamRepository;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private RankingService rankingService;
    public Team registerTeam(List<Member> members) {

        if (members.size() < 2 || members.size() > 4) {
            throw new RuntimeException("Team must have minimum 2 and maximum 4 members");
        }

        Team team = new Team();

        long count = teamRepository.count() + 1;
        team.setTeamName("team" + count);

        for (Member m : members) {
            m.setTeam(team);
        }

        team.setMembers(members);

        return teamRepository.save(team);
    }

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }
    public void submitSprintMarks(Long teamId, int sprintNo, Double marks) {

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        switch (sprintNo) {

            case 1:
                if (team.getSprint1() != null)
                    throw new RuntimeException("Sprint 1 already submitted");
                team.setSprint1(marks);
                break;

            case 2:
                if (team.getSprint2() != null)
                    throw new RuntimeException("Sprint 2 already submitted");
                team.setSprint2(marks);
                break;

            case 3:
                if (team.getSprint3() != null)
                    throw new RuntimeException("Sprint 3 already submitted");
                team.setSprint3(marks);
                break;

            default:
                throw new RuntimeException("Invalid sprint number");
        }

        teamRepository.save(team);

        // After saving sprint → recalculate totals & ranks
        rankingService.updateRanks();
    }
}