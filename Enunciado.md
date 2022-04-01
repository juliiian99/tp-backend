# Enunciado
La inscripción es por tipo de torneo en un rango de fechas determinadas.

# Torneo

Los tipos de torneos pueden ser eliminatorios o por puntaje. 

Los torneos pueden ser por país, por continente o a nivel mundial.

## Torneo por puntaje
Se puede inscribir cualquiera.

Los torneos por puntaje van a tener una determinada cantidad de partidas en un rango  de tiempo establecido. Los tres mejores van a ser los jugadores con la mayor cantidad de puntos finalizado el periodo de competencia.
 
##Torneo eliminatorio  

Se mide por cantidad de victorias.

Los torneos eliminatorios van a tener un periodo de clasificación en el que los jugadores inscritos van a poder jugar una determinada cantidad de partidas en un rango de tiempo establecido (modalidad JCJ).

Los jugadores están divididos por zonas o grupos (de cantidad ilimitada de participantes o por cupo) y clasifican los primeros 2 de cada grupo. Para luego enfrentarse desde octavos hasta una final. 

## Jugadores

Se dividen por tipo (amateur y profesional).

Un jugador no puede jugar más de una partida en una misma fecha y hora (a la vez).

El jugador, realizará una partida de práctica que le indicará el nivel en el que podrá anotarse al torneo.

El jugador, realizará una partida de práctica que le indicará el nivel en el que podrá anotarse al torneo.

Al finalizar cada torneo, vamos a sumar los puntajes de cada participante en las fechas que se realizó dicho torneo y almacenar el puntaje total en la tabla nivel por juego. 

Cuando el jugador reuna la cantidad de puntos necesaria en un juego, se subirá de nivel.

## Caso de uso complejo (Nivel resumen)    Denuncia
los componen el caso de uso Reportar Jugador y el caso de Revisar Denuncia

CUU Reportar Jugador: Un jugador puede reportar a otro en cualquier momento desde la inscripción hasta el final de la competencia.

CUU Revisar denuncia: Los administradores reciben una denuncia a un jugador con una descripción y la analizan en un plazo corto de tiempo.

CUR Evaluar denuncia del Jugador 

## Caso de uso complejo (Nivel resumen)    Todo el torneo


## Niveles de usuario

Administrador (Todos los permisos)

Jugador(Sólo abmc de jugador e inscripción)

Encargado de lista (Solo ver puntajes y publicarlos)


# DER_V1.0
![image](https://user-images.githubusercontent.com/64239565/127723889-43718bb7-a79c-4c42-9814-039742540046.png)

--------------------------------------------------------------------------------------------------------------------------------------------------------

# Checklist

## Backend

|Requerimiento funcional|cant. mín.<br>1 o 2 integ|cant. máx.<br>3 o 4 integ|Detalle/Listado de casos|Cumple|
|:-|-:|-:|:-|-|
|ABMC simple|1 x integ|1 x integ|
|ABMC dependiente|1|2|
|Listado simple|1|1|
|Listado complejo obligatorio|1|2|
|Listado adicional con filtro|0|0|
|Detalle básico|1(*)|2(*)|
|Detalle parametrizable|0|0|
|Otros|0|0|

(\*) Los detalles básicos pueden ser reemplazado por un detalle parametrizados en los

## Frontend

|Requerimiento|Cumple|
|:-|-|
|Invocar API listado||
|Invocar API detalle||
|Mostrar detalle al hacer click <br>en elemento del listado||

## Requerimientos Técnicos

|Requerimiento técnico|Cumple|
|:-|-|
|Framework frontend||
|Framework CSS o preprocesador CSS||
|Framework backend||
|Uso de API REST o GraphQL||
|ORM/ODM||
|Base de datos persistente||
