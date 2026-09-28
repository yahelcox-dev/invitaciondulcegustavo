# AGENTS.md

## Proyecto

Página web estática utilizando:

* HTML
* Bootstrap
* CSS
* JavaScript vanilla

No utilizar frameworks ni librerías adicionales salvo que se solicite explícitamente.

---

## Objetivo principal

Modificar únicamente lo necesario para cumplir la tarea solicitada.

Prioridades:

1. No romper funcionalidades existentes.
2. Mantener el diseño actual.
3. Reutilizar el código existente.
4. Hacer cambios pequeños y localizados.
5. Evitar reescrituras innecesarias.

---

## Estructura

Antes de modificar archivos, identifica primero dónde está implementada la funcionalidad solicitada.

Archivos habituales:

* `*.html` → estructura y contenido
* `*.css` → estilos
* `*.js` → comportamiento
* `assets/` → imágenes, fuentes y recursos
* `vendor/` → librerías locales

No inspeccionar archivos que no estén relacionados con la tarea.

---

## Regla de alcance

Si la tarea es pequeña:

* modifica solamente los archivos necesarios;
* no reorganices el proyecto;
* no cambies clases o IDs existentes sin necesidad;
* no cambies el diseño de otras secciones;
* no refactorices JavaScript no relacionado.

Ejemplo:

Si se solicita:

"Agrega validación al formulario de contacto."

No modificar:

* navbar
* footer
* otras páginas
* estilos no relacionados
* estructura general del proyecto

---

## HTML

Mantener:

* estructura semántica existente;
* IDs existentes;
* clases existentes;
* atributos utilizados por JavaScript;
* atributos utilizados por Bootstrap.

No cambiar un `id`, `class`, `data-*` o selector si puede romper JavaScript o Bootstrap.

Antes de crear un nuevo componente, buscar si ya existe uno reutilizable.

---

## Bootstrap

Utilizar las clases de Bootstrap que ya utiliza el proyecto.

Preferir:

```html
class="container"
class="row"
class="col-md-6"
class="d-flex"
class="btn btn-primary"
```

antes que crear CSS personalizado cuando Bootstrap ya proporciona la funcionalidad necesaria.

No cambiar la versión de Bootstrap.

No agregar otra versión de Bootstrap.

No agregar componentes de otras librerías sin autorización.

---

## CSS

Antes de crear CSS nuevo:

1. Buscar si ya existe una regla equivalente.
2. Reutilizar clases existentes cuando sea posible.
3. Utilizar Bootstrap si resuelve correctamente el problema.

Evitar:

* `!important` salvo que sea realmente necesario;
* estilos duplicados;
* selectores excesivamente complejos;
* modificar estilos globales para solucionar un problema local;
* reescribir el CSS completo.

Mantener el estilo visual existente.

---

## JavaScript

Utilizar JavaScript vanilla.

No introducir:

* React
* Vue
* Angular
* jQuery
* TypeScript
* frameworks adicionales

salvo solicitud explícita.

Antes de crear una función nueva:

* buscar funciones existentes relacionadas;
* reutilizar utilidades existentes;
* mantener el patrón utilizado actualmente por el proyecto.

No cambiar APIs o nombres de funciones existentes sin necesidad.

---

## DOM

Al modificar JavaScript:

* respetar los IDs y clases existentes;
* evitar consultas DOM innecesarias;
* reutilizar referencias cuando sea apropiado;
* no agregar listeners duplicados.

Preferir código claro y pequeño.

Ejemplo:

```js
const button = document.getElementById('submitButton');
```

en lugar de realizar repetidamente la misma búsqueda cuando no sea necesario.

---

## Eventos

Antes de agregar un `addEventListener`:

* comprobar si ya existe uno para el mismo elemento/evento;
* evitar listeners duplicados;
* respetar la arquitectura existente.

---

## Dependencias

No instalar paquetes.

No agregar npm, bundlers o frameworks.

El proyecto debe continuar funcionando como página web estática salvo que se solicite explícitamente otra cosa.

---

## Validación

Después de modificar HTML/CSS/JS:

1. Revisar errores de sintaxis.
2. Revisar selectores y referencias a IDs/clases.
3. Comprobar que no se hayan roto eventos existentes.
4. Si existe una forma sencilla de ejecutar/verificar la página, utilizarla.

No ejecutar procesos innecesarios.

No crear una infraestructura de testing solamente para realizar un cambio pequeño.

---

## Errores existentes

Si encuentras errores no relacionados con la tarea:

* no los corrijas automáticamente;
* no modifiques código no relacionado;
* informa brevemente de su existencia.

---

## Archivos y recursos

No eliminar:

* imágenes;
* fuentes;
* archivos CSS;
* archivos JS;
* HTML;
* recursos en `assets/`

sin confirmar que ya no son utilizados.

No modificar archivos generados o externos salvo que sea necesario.

---

## Diseño responsive

Mantener compatibilidad con:

* móvil;
* tablet;
* escritorio.

No solucionar un problema de escritorio rompiendo móvil, ni viceversa.

Cuando sea necesario modificar responsive:

* revisar primero las clases Bootstrap existentes;
* utilizar los breakpoints existentes;
* evitar cambios globales innecesarios.

---

## Seguridad

No introducir:

* claves API;
* contraseñas;
* tokens;
* credenciales;
* información privada.

No eliminar validaciones existentes para solucionar errores.

No insertar contenido proporcionado por usuarios directamente mediante `innerHTML` cuando pueda existir riesgo de XSS.

Preferir `textContent` cuando corresponda.

---

## Git

No realizar automáticamente:

* `git reset --hard`
* `git clean`
* eliminación masiva de archivos
* rebase destructivo

No sobrescribir cambios existentes realizados por el usuario.

No hacer commits automáticamente salvo que se solicite.

---

## Comunicación

Mantener las respuestas breves.

Al terminar una tarea informar únicamente:

### Cambios

* archivos modificados
* cambio realizado

### Validación

* comprobaciones realizadas

### Pendientes

* solamente si existe algún problema real

No explicar código línea por línea salvo que se solicite.

---

## Regla de eficiencia

Utilizar este flujo:

```text
buscar → inspeccionar → modificar → verificar
```

No utilizar este flujo:

```text
leer todo el proyecto → analizar todo → reescribir todo
```

Para cambios pequeños, limitar el trabajo al área afectada.

---

## Regla final

La mejor solución es la modificación más pequeña que:

* resuelva correctamente la tarea;
* preserve el comportamiento existente;
* mantenga el diseño;
* no introduzca dependencias innecesarias;
* sea fácil de mantener.

No realizar mejoras adicionales que no hayan sido solicitadas.
