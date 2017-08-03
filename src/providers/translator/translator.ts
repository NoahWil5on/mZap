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
            submit: "Submit",
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
            noLogin: "Unable to sign user in at this time",
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
            post: "Posts: ",
            last: "Last Active: ",
            first: "Account Created: ",
            reports: "My Reports:",
            type: "Type: ",
            status: "Status: ",
            map: "View on Map"
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
            type: "Type: ",
            status: "Status: ",
            by: "Reported By: ",
            anonymous: "Anonymous",
            map: "View on Map",
            profile: "View Profile"
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
        filter: {
            filter: "Filter",
            type: "Type:",
            status: "Status:",
            rating: "Rating:",
            cancel: "Cancel",
            error: "Select at least one status and one type"
        },
        editProfile: {
            edit: "Edit Profile",
            loading: "Updating User Profile...",
            name: "Name",
            pic: "Picture",
            submit: "Submit",
            delete: "Delete",
            error: "Name must be at least 2 characters in length",
            openCam: "Open Camera",
            openAlb: "Open Album"
        },
        editPost: {
            edit: "Edit Post",
            description: "Description of Report",
            type: "Type",
            status: "Status",
            change: "Change Picture",
            openCam: "Open Camera",
            openAlb: "Open Album",
            submit: "Submit",
            show: "Show Username",
            error: "Report must contain a description"
        },
        home: {
            view: "View Map",
            report: "Report",
            reports: "All Reports"
        },
        forgot: {
            forgot: "Forgot Password",
            loading: "Sending password reset email...",
            sent: "Email sent successfully!",
            check: "Check your email to reset your password",
            enter: "Enter Email",
            send: "Email Me"
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
            noLogin: "No se puede firmar usuario en este momento",
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
            post: "Publicación: ",
            last: "Último Activo: ",
            first: "Cuenta Creada: ",
            reports: "Mis Reportes:",
            type: "Tipo: ",
            status: "Estado: ",
            map: "Ver en el Mapa"
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
            type: "Tipo: ",
            status: "Estado:",
            by: "Reportado Por: ",
            anonymous: "Anónimo",
            map: "Ver en el Mapa",
            profile: "Ver Perfil"
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
        filter: {
            filter: "Filtrar",
            type: "Tipo:",
            status: "Estado:",
            rating: "Clasificación:",
            cancel: "Cancelar",
            error: "Seleccione al menos un estado y un tipo"
        },
        editProfile: {
            edit: "Editar Perfil",
            loading: "Actualización de Perfil de Usuario...",
            name: "Nombre",
            pic: "Imagen",
            submit: "Enviar",
            delete: "Borrar",
            error: "El nombre debe tener al menos 2 caracteres de longitud",
            openCam: "Abrir Cámara",
            openAlb: "Abrir Album"
        },
        editPost: {
            edit: "Editar post",
            description: "Descripción del informe",
            type: "Tipo",
            status: "Estado",
            change: "cambiar imagen",
            openCam: "Abrir Cámara",
            openAlb: "Abrir Album",
            submit: "Enviar",
            show: "Mostrar nombre de usuario",
            error: "Informe debe contener una descripción"
        },
        home: {
            view: "Ver el Mapa",
            report: "Reportar",
            reports: "Todos los Informes"
        },
        forgot: {
            forgot: "Olvidó tu Contraseña",
            loading: "Enviar correo electrónico de restablecimiento de contraseña...",
            sent: "¡Correo enviado correctamente!",
            check: "Revise su correo electrónico para restablecer su contraseña",
            enter: "Ingrese Correo Electrónico",
            send: "Envíeme un Correo Electrónico"
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
