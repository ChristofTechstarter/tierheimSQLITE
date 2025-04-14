-- SQLite


INSERT INTO tiere(tierart,name,krankheit,age,gewicht) 
VALUES ("Hund","Bello","husten",5,12.4), ("Katze", "Mino", "Rechtes Auge Blind", 5, 8.7);

INSERT INTO tiere(tierart,name,krankheit,age,gewicht) 
VALUES ("Katze","Paw","schnupfen",5, 7.1);

INSERT INTO tiere (tierart, name, krankheit, age, gewicht)
VALUES ("Hund", "Chase", "zecken", 7, 14.8);

INSERT INTO tiere (tierart, name, krankheit, age, gewicht)
VALUES ("Papagei", "Jack", "federallergie", 2, 0.9);

INSERT INTO tiere (tierart, name, krankheit, age, gewicht)
VALUES ("Meerschweinchen", "Ham", "gesund", 1, 0.75);
INSERT INTO tiere (tierart, name, krankheit, age, gewicht)
VALUES ("Pferd", "Esel", "kolik", 10, 550);

SELECT * FROM tiere;