import { Injectable } from '@angular/core';

@Injectable()
export class TranslatorProvider {

    //The text that will be used by all the pages
    text: any = {}
    
    //English verstion of Text
    en: any = {
        add: {
            describe: "Describe what you're reporting",
            openCam: "Open Camera",
            openAlb: "Open Album",
            username: "Show Username?",
            submit: "submit",
            submitting: "Submitting Content...",
            imageAlertTitle: "Are you sure you want to submit this without a photo?",
            imageAlertSubTitle: "Adding a photo will allow other users to better assess your report",
            cancel: "Cancel",
            error: "Fill out all fields"
        },
        confirmation: {
            success: "Successfully Submitted!",
            report: "Report:",
            type: "Type:",
            description: "Description:",
            viewable: "Your name is viewable to other users on this post",
            notViewable: "Your name is not viewable to other users on this post",
            pic: "Picture:",
            map: "Back to Map"            
        },
        infoWindow: {
            info: "Information",
            resolve: "Resolve",
            wait: "Waiting to be marked complete",
            author: "Posted by: ",
            noAuthor: "Posted anonymously",
            status: "Status: ",
            delete: "Delete",
            mark: "Mark Complete",
            note: "Note (Optional)",
            photo: "Add Photo*",
            openCam: "Open Camera",
            openAlb: "Open Album",
            resolution: "Resolve!",
            deleteAlertTitle: "Are you sure?",
            deleteAlertSubTitle: "Deleting a post is permanent and cannot be undone",
            cancel: "Cancel",
            submitting: "Submitting Content...",
            submitted: "Successfully Submitted",
            ok: "OK",
            error: "Fill out all fields",
            marking: "Marking as complete...",
            marked: "Marked as Complete!"
            
        },
        login: {
            login: "Login",
            account: "Don't have an account? ",
            signUp: "Sign Up",
            password: "Forgot Password",
            anonymous: "Sign in anonymously",
            verify: "Verifying User...",
            anonymousAlertTitle: "Sign in anonymously",
            anonymousAlertSubTitle: "When signed in anonymously you can view other's posts but you cannot interact with or create them",
            ok: "OK"
        },
        map: {
            go: "Go"
        },
        profile: {
            profile: "Profile",
            reports: "My Reports:",
            type: "Type: ",
            status: "Status: "
        },
        register: {
            create: "Creat an Account",
            name: "Name*",
            email: "Email*",
            pass1: "Password*",
            pass2: "Re-enter Password*",
            pic: "Add a Profile Picture",
            openCam: "Open Camera",
            openAlb: "Open Album",
            register: "Register"
        },
        reports: {
            reports: "Reports",
            soon: "Content Coming Soon!"
        },
        settings: {
            settings: "Settings",
            logout: "Logout",
            return: "Return to Login"
        },
        topRated: {
            topRated: "Top Rated Users",
            you: "You"
        },
        menu: {
            user: "Unknown User",
            map: "Map",
            reports: "Reports",
            rankings: "Rankings",
            settings: "Settings"
        }
    }
    //Spanish Version of text
    es: any = {
        add: {
            describe: "Describe lo que estás informando",
        }
    }
    
    constructor() {
        this.selectLanguage(this.en);
    }
    selectLanguage(lang){
        this.text = lang;
    }
}
