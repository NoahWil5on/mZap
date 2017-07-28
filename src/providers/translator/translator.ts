//vanilla ionic imports
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
            go: "Go",
            buildingTitle: "Abandoned building",
            buildingDescription: "Report an abandoned building at this location",
            bugsTitle: "Mosquitos",
            bugsDescription: "Report a breeding location of mosquitos at this location",
            pestsTitle: "Pests",
            pestsDescription: "Make a report on pests you found at this location",
            trashTitle: "Garbage",
            trashDescription: "Report an instance of garbage at this location",
            ok: "OK",
            cancel: "Cancel"
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
            register: "Register",
            fill: "Be sure to fill out all fields",
            identical: "Passwords must be identical"
        },
        reports: {
            reports: "Reports",
            soon: "Content Coming Soon!"
        },
        settings: {
            settings: "Settings",
            logout: "Logout",
            return: "Return to Login",
            lang: "Language"
        },
        topRated: {
            topRated: "Top Rated Users",
            you: "You",
            fetch: "Fetching Top Users..."
        },
        menu: {
            user: "Unknown User",
            map: "Map",
            reports: "Reports",
            rankings: "Rankings",
            settings: "Settings"
        },
        discussion: {
            discussion: "Discussion"
        },
        other: {
            complete: "Complete",
            todo: "To Do",
            building: "Abandoned Building",
            pest: "Pests",
            trash: "Trash",
            bug: "Mosquitos"
        }
    }
    //Spanish Version of text
    es: any = {
        add: {
            describe: "Describa lo que está reportando",
            openCam: "Abrir Cámara",
            openAlb: "Abrir Album",
            username: "¿Mostrar su nombre de usuario?",
            submit: "Enviar",
            submitting: "Enviando contenido...",
            imageAlertTitle: "¿Está seguro de querer enviar sin foto?",
            imageAlertSubTitle: "Inlcuir una foto ayudará a otros usuarios a entender mejor su reporte",
            cancel: "Cancelar",
            error: "Leene todos los espacios"
        },
        confirmation: {
            success: "¡Envio Exitoso!",
            report: "Reporte:",
            type: "Tipo:",
            description: "Descripción:",
            viewable: "Su nombre será visto por otros usuarios en este reporte",
            notViewable: "Su nombre no será visto por otros usuarios en este reporte",
            pic: "Imagen:",
            map: "Volver al Mapa"            
        },
        infoWindow: {
            info: "Información",
            resolve: "Resolver",
            wait: "Esperando marca de completado",
            author: "Reportado por: ",
            noAuthor: "Reporte anónimo",
            status: "Estado: ",
            delete: "Borrar",
            mark: "Marcar como completado",
            note: "Nota (Opcional)",
            photo: "Incluir Foto*",
            openCam: "Abrir Cámara",
            openAlb: "Abrir Album",
            resolution: "¡Resolver!",
            deleteAlertTitle: "¿Está Seguro?",
            deleteAlertSubTitle: "Deleting a post is permanent and cannot be undone",
            cancel: "Cancelar",
            submitting: "Enviando Contenido...",
            submitted: "¡Envio Exitoso!",
            ok: "OK",
            error: "Leene todos los espacios",
            marking: "Marcando como completado...",
            marked: "¡Marcado como completado!"
            
        },
        login: {
            login: "Ingresar",
            account: "No tiene una cuenta? ",
            signUp: "Inscribirse",
            password: "Olvidó su contraseña",
            anonymous: "Ingresar de manera anónima",
            verify: "Verificando Usuario...",
            anonymousAlertTitle: "Ingresar de manera anónima",
            anonymousAlertSubTitle: "Cuando ingresa de manera anónima usted puede ver los reportes de otros pero no puede interactuar con o crear reportes.",
            ok: "OK"
        },
        map: {
            go: "Ir",
            buildingTitle: "Edificación Abandonada",
            buildingDescription: "Reportar una edificación abandonada en esta ubicación",
            bugsTitle: "Mosquitos",
            bugsDescription: "Reportar una zona de reproducción de mosquitos en esta ubicación",
            pestsTitle: "Plagas",
            pestsDescription: "Hacer un reporte de plagas encontradas en esta ubicación",
            trashTitle: "Desperdicio/Basura",
            trashDescription: "Reporte una isntancia de basura en esta ubicacióm",
            ok: "OK",
            cancel: "Cancelar"
        },
        profile: {
            profile: "Perfíl",
            reports: "Mis Reportes:",
            type: "Tipo: ",
            status: "Estado: "
        },
        register: {
            create: "Crear una cuenta",
            name: "Nombre*",
            email: "Correo Electrónico*",
            pass1: "Contraseña*",
            pass2: "Re-Ingrese su contraseña*",
            pic: "Añadir una foto de perfíl",
            openCam: "Abrir Cámara",
            openAlb: "Abrir Album",
            register: "Registrarse",
            fill: "Asegúrese de llenar todos los espacios",
            identical: "Las contraseñas debe ser idénticas"
        },
        reports: {
            reports: "Reportes",
            soon: "¡Contenido Próximamente!"
        },
        settings: {
            settings: "Ajustes",
            logout: "Salir",
            return: "Volver a Ingresar",
            lang: "Idioma"
        },
        topRated: {
            topRated: "Usuarios mejor calificados",
            you: "tú",
            fetch: "buscando usuarios mejor calificados..."
        },
        menu: {
            user: "Usuario Desconocido",
            map: "Mapas",
            reports: "Reportes",
            rankings: "Clasificación",
            settings: "Ajustes"
        },
        discussion: {
            discussion: "Discusión"
        },
        other: {
            complete: "Completar",
            todo: "Que Hacer",
            building: "Edificación Abandonada",
            pest: "Plagas",
            trash: "Desperdicio/Basura",
            bug: "Mosquitos"
        }
    }
    
    constructor() {
        this.selectLanguage(this.es);
    }
    //sets language to whatever is put into the parameter
    selectLanguage(lang){
        this.text = lang;
    }
}
