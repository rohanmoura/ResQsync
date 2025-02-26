package com.reqsync.Reqsync.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.reqsync.Reqsync.Dto.VolunterrTypes;
import com.reqsync.Reqsync.Entity.Volunteer;

import jakarta.transaction.Transactional;

@Repository
public interface VolunteerTypeRepository extends JpaRepository<Volunteer, Long> {

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM volunteer_types WHERE volunteer_id = :volunteerId", nativeQuery = true) // nativeQuery =
                                                                                                        // true → Since
                                                                                                        // volunteer_types
                                                                                                        // is an element
                                                                                                        // collection
                                                                                                        // table, we
                                                                                                        // need raw SQL.
    void deleteAllByVolunteerId(@Param("volunteerId") Long volunteerId);

}
