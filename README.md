# TaskFlow

Aplicación híbrida desarrollada con **Ionic + Angular + Cordova**, orientada a la gestión de tareas con categorías, filtros dinámicos y control de funcionalidades mediante **feature flags (Firebase Remote Config)**.

## Descripción

TaskFlow permite a los usuarios gestionar sus tareas de forma eficiente, ofreciendo:

- Creación y eliminación de tareas
- Edición de tareas: cambio de nombre, cambio o eliminación de categoría asociada
- Marcar tareas como completadas
- Filtros por estado (total / completadas)
- Filtros por categoría (habilitados dinámicamente)
- Gestión completa de categorías(creación, edición y eliminación)
- Control de funcionalidades mediante configuración remota (feature flags)

---

## Entorno de desarrollo
El proyecto fue desarrollado con versiones recientes de las siguientes tecnologías. 
Se recomienda utilizar versiones iguales o superiores, asegurando compatibilidad con Angular 16:

- Node.js: 24.15.0
- npm: 11.12.1
- Ionic CLI: 7.2.1
- Angular: 20.0.0
- Cordova: 13.0.0
- Java JDK: 21.0.8
- Android SDK (API 36)
- Gradle: 9.4.1 

## Instalación
Instalación de herramientas globales:
- npm install -g @ionic/cli cordova

Clonar repositorio

La rama `main` contiene la versión final y estable de la aplicación.
- git clone https://github.com/mimuriel/taskboard-app.git
- cd taskboard-app

Instalar dependencias
- npm install

## Configuración de Firebase
El proyecto utiliza Firebase Remote Config para controlar dinámicamente funcionalidades.

Archivo de configuración:
- src/environments/firebase.config.ts
```bash
export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};
```
## Feature Flags (Remote Config)
Se implementa la bandera:
- isCategoriesEnabled
  
| Valor | Resultado |
|----------|------------------|
| True | Habilita categorías y filtros por categoría |
| False | Oculta completamente la funcionalidad de categorías |

## Integración con el backend
La aplicación TaskFlow está integrada de forma fullstack con una API RESTful desarrollada en Spring Boot. Para garantizar la consistencia de los datos y cumplir con los requisitos técnicos de la prueba, se ha implementado una arquitectura de sincronización en tiempo real entre las entidades del cliente y el servidor.

### Mapeo de Entidades Fullstack

Se aplica un mapeo de dominio para desacoplar la interfaz de usuario de la lógica de negocio del servidor:

- Interfaz (Ionic): El usuario gestiona Categorías.
- Servidor (Spring Boot): El sistema procesa y almacena Franquicias.

### Implementación de Servicios (CRUD)

El frontend utiliza el módulo provideHttpClient de Angular para ejecutar operaciones asíncronas que se reflejan directamente en la base de datos:

- Listado: Recupera la colección de franquicias mediante un método GET y las renderiza dinámicamente como categorías.
- -Creación: Al crear una categoría, se envía una petición POST al backend (CreateFranchiseUseCase), asegurando que los cambios persistan en el dominio de franquicias.
- Actualización: Al editar una categoría, se envía una petición PATCH al backend (UpdateFranchiseUseCase), asegurando que los cambios persistan en el dominio de franquicias.
 -Borrado Seguro: Al solicitar la eliminación de una categoría (DELETE), el sistema depende de la validación de integridad referencial del backend, la cual impide el borrado si existen dependencias activas (sucursales).

### Configuración de Conectividad y CORS
Para que la aplicación móvil pueda comunicarse con el servidor durante el desarrollo, se deben considerar los siguientes puntos de acceso:

- Acceso desde Navegador (Localhost)
Por defecto, la aplicación consume el backend en la dirección local estándar de desarrollo de Ionic:

  Origin permitido: 
  ```
  http://localhost:8100
  ```

- Acceso desde Dispositivo Físico / Red Local (LAN)
Para probar la aplicación en un celular real conectado a la misma red WiFi que el servidor, es necesario ajustar la URL base del servicio en el frontend y habilitar la IP en el backend:

- En el Backend: En CorsConfig.java, asegúrese de añadir la dirección IP local de su PC:
  ```
  config.addAllowedOrigin("http://<TU_IP_LOCAL>:8100");
  ```
- En el Frontend: Se debe actualizar la variable de entorno para apuntar a la IP del servidor en lugar de localhost en taskboard-app\src\environments\environment.ts
  ```
  export const environment = {
    production: false,
    apiUrl: '<TU_IP_LOCAL>:8081',
  };
  ```
## Ejecución del Proyecto

Ejecutar en entorno local navegador
- ionic serve
  
Aplicación disponible en: 
- http://localhost:8100

Prueba en Dispositivo Móvil

Para probar en un dispositivo dentro de la misma red:
- ionic serve --external
  
Abrir en el navegador del dispositivo: 
- http://<IP_LOCAL>:8100

## Compilación Android (APK)
- ionic cordova build android
  
APK generado en:
- platforms\android\app\build\outputs\apk\debug\app-debug.apk

## Compilación iOS (IPA)
Requisitos:
- macOS + Xcode + cuenta Apple Developer

comandos
- ionic cordova platform add ios
- ionic cordova build ios

Nota importante: La generación del archivo .ipa no se realizó debido a limitaciones del entorno (Windows). Sin embargo, el proyecto está configurado para su compilación en macOS.

## Decisiones técnicas
- Arquitectura basada en NgModule.
- Separación de responsabilidades mediante servicios.
- Uso de observables para el manejo reactivo de tareas y categorías.
- Persistencia local de tareas y categorías.
- Control dinámico de funcionalidades mediante Firebase Remote Config.
- Configuración preparada para compilación híbrida con Cordova.

## Estructura del proyecto
```text
src/app/
  core/
    services/        Servicios principales de la aplicación
  shared/
    models/          Modelos de datos
  home/              Módulo principal de tareas
  app.module.ts      Módulo raíz de la aplicación
  app-routing.module.ts Rutas principales
```

## 📸 Vista de la aplicación
### Pantalla principal
<p align="center">
  <img src="src/docs/home.png" width="300"/>
</p>

### Gestión de categorías
<p align="center">
<img src="src/docs/categories.png" width="200"/>
<img src="src/docs/managementCategories.png" width="200"/>
</p>

### Gestión de tareas
<p align="center">
<img src="src/docs/createTask.png" width="200"/>
<img src="src/docs/listTask.png" width="200"/>
</p>
