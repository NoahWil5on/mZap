//vanilla ionic imports
import { Injectable } from '@angular/core';

@Injectable()
export class TranslatorProvider {

    //The text that will be used by all the pages
    text: any = {}
    
    //English verstion of Text
    en: any = {
        add: {
            describe: "Add Description",
            openCam: "Open Camera",
            openAlb: "Open Album",
            username: "Show Username?",
            submit: "Submit",
            submitting: "Submitting Content...",
            imageAlertTitle: "Are you sure you want to submit this without a photo?",
            imageAlertSubTitle: "Adding a photo will allow other users to better assess your report",
            cancel: "Cancel",
            error: "Fill out all fields",
            thanks: "Thanks!",
            share: "Tell your friends about mZAP!",
            show: "Username is visible",
            noShow: "Username is NOT visible",
            errorType: "*Add a type to the report*",
            errorImage: "*Add a photo of the incident*",
            leaveTitle: "Are you sure you want to abandon this post?",
            leaveSubTitle: "The photo you've submitted will not be saved",
            leave: "Leave",
            stay: "Stay",
            photoTitle: "add a photo of what you're reporting"
        },
        confirmation: {
            success: "Successfully Submitted!",
            report: "Report:",
            type: "Type:",
            description: "Description:",
            viewable: "Your name is viewable to other users on this post",
            notViewable: "Your name is not viewable to other users on this post",
            pic: "Picture:",
            map: "Back to Map",
            share: "Thank you! Share your Report!"            
        },
        infoWindow: {
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
            marked: "Marked as Complete!",
            editPost: "Edit Post",
            notes: "Notes",
            edit: "Edit",
            info: "Info",
            aboutTitle: "What is the commenting feature?",
            aboutMessage: "When you comment on a post everyone will be able to see your comment. This feature allows community members to better communicate what needs to be done in order to resolve an issue.",
            shipAboutMessage: "When you comment on a post everyone will be able to see your comment. This feature allows community members to know whats happening with the ships."
        },
        login: {
            email: "Email",
            password: "Password",
            noLogin: "Unable to sign user in at this time",
            signUp: "CREATE ACCOUNT",
            forgot: "FORGOT ACCOUNT",
            anonymous: "Sign in anonymously",
            verify: "Verifying User...",
            anonymousAlertTitle: "Sign in anonymously",
            anonymousAlertSubTitle: "When signed in anonymously you can view other's posts but you cannot interact with or create them",
            ok: "OK",
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
            cndTitle: "Cats/Dogs",
            cndDescription: "Report a citing of stray animals",
            fix: "Fix it",
            ok: "OK",
            cancel: "Cancel",
            edit: "Edit"
        },
        profile: {
            profile: "Profile",
            post: "Posts: ",
            last: "Last Active: ",
            first: "Account Created: ",
            reports: "My Reports:",
            type: "Type: ",
            status: "Status: ",
            map: "View on Map",
            posts: "Posts",
            resolves: "Resolves",
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
            identical: "Passwords must be identical",
            key: "Login Key*",
            creating: "Creating Account...",
            badKey: "Incorrect login key",
            sixChar: "Password must be at least 6 characters",
            photoTitle: "Add a profile photo!",
            surveyMain: "survey",
            msurvey: "A $2.00 gift card will be sent to your email after completion of this survey.",
            msurveyTitle: "Please complete the following Survey!",
            msurveySub: "Don’t miss the chance of completing the survey and receiving a gift card!",
            survey: "Complete this survey to help us learn more about the community in Culebra and their usage of ¡mZAP!",
            surveyTitle: "Please complete the following Survey!",
            surveySub: "Completing this survey will help us better understand the community of Culebra and its use of technology.",
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
            lang: "Language",
            posts: "My Posts",
            notifications: "Notifications",
            resolves: "My Resolutions",
            comments: "My Comments",
            likes: "My Liked Posts"
        },
        topRated: {
            topRated: "Top Rated Users",
            you: "You",
            fetch: "Fetching Top Users..."
        },
        menu: {
            user: "Unknown User",
            home: "Home",
            map: "Map",
            reports: "Reports",
            rankings: "Rankings",
            settings: "Settings",
            logout: "Logout",
            share: "Share mZAP",
            login: "Login",
            notifications: "Notifications"
        },
        discussion: {
            discussion: "Discussion",
            first: "Hello! Be the first to comment on this post:)"
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
        resolve: {
            noPost: "No one has submitted a resolve yet. Gather up your friends and resolve this post!",
            add: "Add a Resolve!",
            add2: "Add Another Resolution?",
            note: "Note(optional)",
            noDesc: "*No Description*",
            good: "Does Everthing Look Good?",
            noImage: "No Image Added",
            addImage: "Add an image of what you've fixed!"
        },
        forgot: {
            forgot: "Forgot Password",
            loading: "Sending password reset email...",
            sent: "Email sent successfully!",
            check: "Check your email to reset your password",
            enter: "Enter Email",
            send: "Email Me",
            directions: "Enter your email and we will send you a link to reset your password."
        },
        tutorial:{
            help1: "Thank you for creating an account! mZAP is an app that allows you to report things in your community that need to be cleaned up and fixed, including standing water, trash, and broken roofs among others. You can then view these reports and organize groups to clean up these issues.",
            help2: "Here is the map. The blue location icon marks your location. Each red icon shows a report and its type.",
            help3: "You can make a report by clicking the 'plus' button. Then you can take a picture, add a description, and upload it to the map!",
            help4: "Other users can then view your post by clicking on it on the map. There they can comment and upload photos of the work they've done to improve or resolve the situation.",
            trash: "There is trash in the area that needs to be cleaned up.",
            pests: "There are pests or rodents that need to be taken care of.",
            building: "There is an abandoned building.",
            bug: "There is a mosquito problem in the area.",
            cnd: "There are stray or lost animals/pets.",
            water: "There is standing water that mosquitos may be using to breed.",
            ready: "Thats it! Now you're ready to become an mZAPPER!"
        },
        shipTutorial:{
            help1: "The ferry tracking system is a crowd sourced feature designed to keep you informed of where ferry's are and what they're up to.",
            help2: "You can create a report of a ferry by clicking ferry icon in the top left corner of the map and then tapping the \"Report Location\" button in the menu.",
            help3: "Designate which ferry you're reporting along with the departure and arrival locations of your ferry. Each ferry is given its own unique color. After you make the report we take care of everything else!",
            help4: "You can click on ferry markers on the map to see information about the ferry, there you can comment, like, and even edit the report.",
            help5: "The ferry's location on the map will start near the port of departure. Each individual ferry's location can only be reported once every 1.5 hours, after which the ferry will turn gray on the map.",
            help6: "If a ferry is gray on the map this means that it was reported between 1.5 and 3 hours ago so information about the ferry may be inaccurate.",
            help7: "Ferry locations are always estimates based on information about when the ferry departed and where the ferry is headed.<br/><br/>The \"red\" line of a ferry's path represents distance the ferry has already traveled. The gray line represents distance left to be traveled.",
        },
        resolveTutorial:{
            help1: "mZAP's \"resolve\" feature is a tool that allows users to let everyone know that a report has been fixed. To use it, click on \"Fix It\".",
            help2: "Here you can add a photo and a comment about what you did to fix the problem!",
            help3: "After you post a resolve, other users will be able to see your resolution on the \"Fix It\" page.",
            help4: "Posts that have been resolved will appear grayed out on the map."
        },
        shipReport: {
            ready: "Are you sure you want to submit this report?",
            submitted: "Successfully submitted!",
            thanks: "Thank you for reporting the location of the ferry! Your report will help others in and around your community to stay informed!",
            ferry: "Ship",
            start: "Start",
            end: "Destination",
            time: "Current Time:",
            oops: "Oops! You can't do that yet",
            made: "Someone recently made a positing about this ship, try again in",
            hours: "1 hour? and ? minute(s)",
            minutes: "minutes",
            invalid: "The arrival and departure locations cannot be the same",
            invalidTitle: "Error: Invalid Entry"
        },
        shipInformation: {
            depTime: "Departure Time:",
            from: "From:",
            to: "To:"
        },
        shipMenu: {
            title: "Ship Information",
            report: "Report location",
            schedule: "View Schedule",
            punctual: "% Punctual",
            week: "Week",
            month: "Month",
            year: "Year",
            onTime: "on time"
        },
        report: {
            sent: "Report Sent",
            error: "An Error Occurred",
            problem: "Oops, We're not sure what the issue is, please try again in a few moments.",
            make: "Report as inappropriate",
            confirm: "Reporting this post will send a notification to the developers that could lead to this post being taken down or further action. Are you sure you'd like to do this?",
            cancel: "Cancel"
        },
        consent: {
            click: 'By clicking "Join Project" you agree to the terms provided on the information sheet',
            terms: "Read Information Sheet",
            join: "Join Project",
            error: "You must view the information sheet in order to join"
        },
        other: {
            cnd: "Cats / Dogs",
            complete: "Resolved",
            todo: "To Do",
            building: "Abandoned Building",
            pest: "Pests",
            trash: "Trash",
            bug: "Mosquitos",
            bugs: "Mosquitos",
            water: "Standing Water",
            road: "Blocked Road",
            tree: "Fallen Tree",
            rocked: "Rocks in Road",
            drink: "Drinkable Water Needed",
            electricity: "Exposed Electricity",
            language: "English",
            ferry: "Mark Ferry Location",
            schedule: "Ferry Schedule",
            search: "Search...",
            share: "Share",
            report: "Report Post"
        }
    }
    //Spanish Version of text
    es: any = {
        add: {
            describe: "Descripción",
            openCam: "Abrir Cámara",
            openAlb: "Abrir Album",
            username: "¿Mostrar su nombre de usuario?",
            submit: "Enviar",
            submitting: "Enviando contenido...",
            imageAlertTitle: "¿Está seguro de querer enviar sin foto?",
            imageAlertSubTitle: "Incluir una foto ayudará a otros usuarios a entender mejor su reporte",
            cancel: "Cancelar",
            error: "Leene todos los espacios",
            thanks: "¡Gracias!",
            share: "¡Dile a tus amigos acerca ¡mZAP!",
            show: "Nombre de usuario visible",
            noShow: "El nombre de usuario NO está visible",
            errorType: "*Añadir un tipo al informe*",
            errorImage: "*Añadir una foto del incidente*",
            leaveTitle: "¿Estás seguro de que quieres abandonar esta publicación?",
            leaveSubTitle: "La foto que has enviado no se guardará",
            leave: "sí",
            stay: "no",
            photoTitle: "agrega una foto de lo que estás informando"
        },
        confirmation: {
            success: "¡Envio Exitoso!",
            report: "Reporte:",
            type: "Tipo:",
            description: "Descripción:",
            viewable: "Su nombre será visto por otros usuarios en este reporte",
            notViewable: "Su nombre no será visto por otros usuarios en este reporte",
            pic: "Imagen:",
            map: "Volver al Mapa",
            share: "¡Gracias! ¡Comparte tu Reporte!"       
        },
        infoWindow: {
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
            deleteAlertSubTitle: "Eliminar una publicación es permanente y no se puede deshacer",
            cancel: "Cancelar",
            submitting: "Enviando Contenido...",
            submitted: "¡Envio Exitoso!",
            ok: "OK",
            error: "Llene todos los espacios",
            marking: "Marcando como completado...",
            marked: "¡Marcado como completado!",
            editPost: "Editar publicación",
            notes: "Notas",
            edit: "Editar",
            info: "Detalles",
            aboutTitle: "¿Cuál es la función de comentarios?",
            aboutMessage: "Cuando comenta una publicación, todos podrán ver su comentario. Esta característica permite a los miembros de la comunidad comunicar mejor lo que se debe hacer para resolver un problema.",
            shipAboutMessage: "Cuando comentas en un post, todas las personas podrán ver su comentario. Esta función permite que los miembros de la comunidad sepan que está pasando con las embarcaciones."
        },
        login: {
            email: "Correo Electrónico",
            noLogin: "No se puede confirmar usuario en este momento",
            password: "Contraseña",
            signUp: "CREAR UNA CUENTA",
            forgot: "OLVIDÓ LA CUENTA",
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
            cndTitle: "Gatos/Perros",
            cndDescription: "Reporte una cita de animales realengos",
            ok: "OK",
            fix: "Arreglar",
            cancel: "Cancelar",
            edit: "Editar"
        },
        profile: {
            profile: "Perfíl",
            post: "Publicación: ",
            last: "Último Activo: ",
            first: "Cuenta Creada: ",
            reports: "Mis Reportes:",
            type: "Tipo: ",
            status: "Estado: ",
            map: "Ver en el Mapa",
            posts: "mensajes",
            resolves: "resolver",
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
            identical: "Las contraseñas debe ser idénticas",
            key: "Clave de Acceso*",
            creating: "Creando Cuenta...",
            badKey: "clave de inicio de sesión incorrecta",
            sixChar: "La contraseña debe tener al menos 6 caracteres",
            photoTitle: "¡Agrega una foto de perfil!",
            surveyMain: "encuesta",
            msurvey: "Por llenar la siguiente encuesta, se le enviará a su correo electrónico una tarjeta de regalo de $2.00.",
            msurveyTitle: "¡Por favor llene la siguiente encuesta!",
            msurveySub: "¡No pierda la oportunidad de completar la encuesta y recibir una tarjeta de regalo!",
            survey: "Complete esta encuesta para ayudarnos a conocer más sobre la comunidad en Culebra y el uso de ¡mZAP!",
            surveyTitle: "¡Por favor llene la siguiente encuesta!",
            surveySub: "Completar esta encuesta nos ayudará a entender mejor a la comunidad de Culebra y su uso de la tecnología.",
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
            lang: "Idioma",
            posts: "Mis Publicaciones",
            notifications: "Notificaciones",
            resolves: "Mis Resoluciones",
            comments: "Mis Comentarios",
            likes: "Mis Posts Favoritos"
        },
        topRated: {
            topRated: "Usuarios mejor calificados",
            you: "tú",
            fetch: "buscando usuarios mejor calificados..."
        },
        menu: {
            home: "Casa",
            user: "Usuario Desconocido",
            map: "Mapas",
            reports: "Reportes",
            rankings: "Clasificación",
            settings: "Ajustes",
            logout: "Salir",
            share: "Compártelo mZAP",
            login: "Iniciar",
            notifications: "Notificaciones"
        },
        discussion: {
            discussion: "Discusión",
            first: "¡Hola! Sé el primero en comentar esta publicación:)"
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
            send: "Envíeme un Correo Electrónico",
            directions: "Ingrese su correo electrónico y le enviaremos un enlace para restablecer su contraseña."
        },
        tutorial:{
            help1: "Gracias por crear una cuenta! mZAP es una aplicación que te permite reportar situaciones o cosas en tu comunidad que necesitan ser limpiadas y arregladas incluyendo estancamientos de agua, basura y techos rotos, entre otros. Tú puedes ver estos reportes y organizar grupos para limpiar estos problemas.",
            help2: "Este es el mapa. El icono azul demarca tu ubicación. Cada icono rojo muestra un reporte y su características.",
            help3: "Tú puedes hacer un reporte haciendo click en el botón 'mas' (+). Después, puedes tomar una foto, añadir una descripción y subirla al mapa!",
            help4: "Otros usuarios podrán entonces ver tus reportes haciendo click sobre ellos en el mapa. Allí, ellos podrán hacer comentarios y subir fotos del trabajo que han hecho para mejorar o resolver la situación.",
            trash: "Hay basura reportada en el área y se necesita que se recoja.",
            pests: "Existe un problema de sabandijas o roedores reportados que hay que atender.",
            building: "Hay un edificio o estructura abandonada reportada.",
            bug: "Existe un problema de mosquitos reportados en esta área.",
            cnd: "Hay animales perdidos o realengos reportados.",
            water: "Hay agua estancada reportada donde los mosquitos pueden reproducirse.",
            ready: "¡Esto es todo! ¡Ya estas listo para ser un mZAPPER!"
        },
        shipTutorial:{
            help1: "El sistema de rastreo del ferry o lancha es uno \"crowdsource\" diseñado para mantenerte informado sobre que está pasando y dónde se encuentran las embarcaciones.",
            help2: "Puedes crear un informe de un ferry haciendo clic en el ícono del ferry en la esquina superior izquierda del mapa y luego tocando el botón \"Reportar Ubicación\" en el menú.",
            help3: "Selecciona que ferry/lancha estás reportando junto con la ubicación, salida y llegada de la embarcación. Cada embarcación tiene su propio color. ¡Después de hacer el reporte, nosotros nos ocupamos de todo lo demás!",
            help4: "En el mapa puedes presionar en el ícono de la embarcación para poder ver mas información acerca de esta, también puedes comentar, darle \"me gusta\" y hasta editar este reporte.",
            help5: "La localización del ferry/lancha en el mapa comenzará muy cerca del muelle de salida. La localización de la embarcación puede ser reportada cada hora y media, luego de pasado este tiempo el ícono se volverá de color gris en el mapa.",
            help6: "Si el ícono de la embarcación está gris, significa que el reporte se generó entre 1.5 a 3 horas. Entonces la información sobre ese reporte podría no estar actualizada.",
            help7: "La localización del ferry/lancha son siempre estimados en base a la información reportada sobre de donde salió la embarcación y cual es su destino.<br/><br/>La línea \"roja\" representa la trayectoria que la embarcación ha recorrido. La línea \"gris\" representa la distancia que aún resta por terminar",
        },
        resolveTutorial:{
            help1: "mZAP posee una herramienta que permite a los usuarios informar a todos que un reporte se ha solucionado. Para poder utilizar esta herramienta presione \"Arreglar\".",
            help2: "En esta area puede agregar una foto y un comentario sobre lo que hizo para solucionar este reporte.",
            help3: "Después de publicar una resolución, otros usuarios podrán ver su resolución en la página de \"arreglar\".",
            help4: "Los reportes que se hayan resuelto aparecerán color gris en el mapa."
        },
        shipReport: {
            ready: "¿Estás seguro/a que quieres someter este reporte?",
            submitted: "¡Exitosamente sometido!",
            thanks: "¡Gracias por reportar la localización de la embarcación! ¡Tu reporte ayudará a otros en tu comunidad a estar informados!",
            ferry: "Lancha o Ferry",
            start: "Comienzo",
            end: "Destino",
            time: "Hora Actual:",
            oops: "¡Uy, por ahora no puedes realizar esto!",
            made: "Alguien recientemente creó un post acerca de esta embarcación, trata nuevamente en",
            hours: "1 hora? y ? minuto(s)",
            minutes: "minuto(s)",
            invalid: "Los lugares de llegada y salida no pueden ser iguales",
            invalidTitle: "Error: Entrada inválida"
        },
        shipInformation: {
            depTime: "Tiempo de Salida:",
            from: "De:",
            to: "Para:"
        },
        shipMenu: {
            title: "Información Embarcaciónes",
            report: "Reportar Ubicación",
            schedule: "Ver Itinerario",
            punctual: "% Puntualidad",
            week: "Semana",
            month: "Mes",
            year: "Año",
            onTime: "a tiempo"
        },
        resolve: {
            noPost: "Nadie ha presentado una resolución todavía. Recoge a tus amigos y resuelve este post!",
            add: "¡Añada una Resolución!",
            add2: "¿Quieres añadir otra resolución?",
            note: "Nota (opcional)",
            noDesc: "*Sin descripción*",
            good: "¿Todo se ve bien?",
            noImage: "No se ha añadido imagen",
            addImage: "¡Añade una imagen de lo que has arreglado!"
        },
        report: {
            sent: "Reporte envíado",
            error: "Ha Ocurrido un Error",
            problem: "Ups, No sabemos bien cual fue el problema, por favor trata nueva vez en unos momentos.",
            make: "Reportar como inapropiado",
            confirm: "¿Al Reportar este “reporte” se estará enviando una notificación a los desarrolladores del app y se podría eliminar este post. Estás seguro que quieres hacer esto?",
            cancel: "Cancelar"
        },
        consent: {
            click: 'Al hacer clic en "Únete al Proyecto", acepta los términos provistos en la hoja informativa.',
            terms: "Lea Hoja Informativa",
            join: "Únete al Proyecto",
            error: "Debes lea la hoja Informativa para unirte"
        },
        other: {
            cnd: "Gatos / Perros",
            complete: "Resuelto",
            todo: "Incompleto",
            building: "Edificación Abandonada",
            pest: "Plagas",
            trash: "Desperdicio / Basura",
            bug: "Mosquitos",
            bugs: "Mosquitos",
            water: "Agua Estancada",
            road: "Camino Bloqueado",
            tree: "Arbol Caido",
            rocked: "Rocas en la Carretera",
            electricity: "Electricidad Expuesta",
            drink: "Necesidad de Agua Potable",
            language: "Español",
            ferry: "Localizar Embarcación",
            schedule: "Horario de la Nave",
            search: "Buscar...",
            share: "Compartir...",
            report: "Reportar Publicacion"
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
