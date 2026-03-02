package com.demo.hackathon_tracker_backend.entity;

import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "table_marks")
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long teamId;

    private String teamName;

    private Double sprint1;
    private Double sprint2;
    private Double sprint3;

    @Column(nullable = false)
    private Double total = 0.0;

    @Column(name = "team_rank")
    private Integer rank = 0;

    @JsonManagedReference
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL)
    private List<Member> members;
    
 // Getters & Setters
	public Long getTeamId() {
		return teamId;
	}

	public void setTeamId(Long teamId) {
		this.teamId = teamId;
	}

	public String getTeamName() {
		return teamName;
	}

	public void setTeamName(String teamName) {
		this.teamName = teamName;
	}

	public Double getSprint1() {
		return sprint1;
	}

	public void setSprint1(Double sprint1) {
		this.sprint1 = sprint1;
	}

	public Double getSprint2() {
		return sprint2;
	}

	public void setSprint2(Double sprint2) {
		this.sprint2 = sprint2;
	}

	public Double getSprint3() {
		return sprint3;
	}

	public void setSprint3(Double sprint3) {
		this.sprint3 = sprint3;
	}

	public Double getTotal() {
		return total;
	}

	public void setTotal(Double total) {
		this.total = total;
	}

	public Integer getRank() {
		return rank;
	}

	public void setRank(Integer rank) {
		this.rank = rank;
	}

	public List<Member> getMembers() {
		return members;
	}

	public void setMembers(List<Member> members) {
		this.members = members;
	}
    
}