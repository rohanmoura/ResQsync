package com.reqsync.Reqsync.Events;

import org.springframework.context.ApplicationEvent;

import com.reqsync.Reqsync.Entity.RequestHelperIssue;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HelpRequestorIssueCreatedEvent extends ApplicationEvent {
    private final RequestHelperIssue helpRequestorIssue;

    public HelpRequestorIssueCreatedEvent(Object source, RequestHelperIssue helpRequestorIssue) {
        super(source);
        this.helpRequestorIssue = helpRequestorIssue;
    }

}
