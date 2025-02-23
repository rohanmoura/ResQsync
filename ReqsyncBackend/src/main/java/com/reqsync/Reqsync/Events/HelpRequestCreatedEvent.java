package com.reqsync.Reqsync.Events;

import com.reqsync.Reqsync.Entity.HelpRequest;
import lombok.Getter;
import lombok.Setter;

import org.springframework.context.ApplicationEvent;

// @EqualsAndHashCode(callSuper = false) This automatically makes: ✔ equals() compare the name field
// ✔ hashCode() return the same value for equal objects
// If you use @EqualsAndHashCode(callSuper = false), it ignores the parent class fields while comparing.
@Getter
@Setter
public class HelpRequestCreatedEvent extends ApplicationEvent {
    private final HelpRequest helpRequest;

    public HelpRequestCreatedEvent(Object source, HelpRequest helpRequest) { // It contains the help request data so
                                                                             // that it can be accessed by the listener.
        super(source);
        this.helpRequest = helpRequest;
    }
}

// {/*Equals*/}
// The Equals method is used to compare two objects to see if they are the same
// in memory and also checks for their content .

// {/*HashCode*/}
// The HashCode method is used to get the hashcode of an object. The hashcode is
// used to compare objects and also to store objects in collections like
// HashMap, HashTable, HashSet, etc.
// If two objects are equal (equals() is true), they must have the same hash
// code.
// Used in HashMaps, HashSets, and HashTables to store and retrieve objects
// efficiently.