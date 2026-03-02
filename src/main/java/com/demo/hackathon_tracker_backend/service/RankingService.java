package com.demo.hackathon_tracker_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demo.hackathon_tracker_backend.entity.Team;
import com.demo.hackathon_tracker_backend.repository.TeamRepository;

@Service
public class RankingService {

    @Autowired
    private TeamRepository teamRepository;

    public void updateRanks() {

        List<Team> teams = teamRepository.findAll();

        // Calculate totals first
        for (Team team : teams) {

            double sum = 0;
            int count = 0;

            if (team.getSprint1() != null) {
                sum += team.getSprint1();
                count++;
            }
            if (team.getSprint2() != null) {
                sum += team.getSprint2();
                count++;
            }
            if (team.getSprint3() != null) {
                sum += team.getSprint3();
                count++;
            }

            double avg = count == 0 ? 0 : sum / count;
            team.setTotal(avg);
        }

        // Sort by total descending
        teams.sort((a, b) -> Double.compare(b.getTotal(), a.getTotal()));

        int rank = 1;
        for (Team team : teams) {
            team.setRank(rank++);
        }

        teamRepository.saveAll(teams);
    }
}