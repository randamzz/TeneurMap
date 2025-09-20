# TeneurMap MA - Application Web pour Données Minières

## Description du Projet

TeneurMap MA est une application web innovante conçue spécifiquement pour la visualisation et l'analyse des données minières au Maroc. Cette plateforme permet de visualiser interactivement les coordonnées (x, y, z) et les pourcentages de teneur des échantillons miniers, avec une intégration de fonctionnalités de prédiction avancées utilisant modèle de machine learning.

## Objectifs Principaux

- **Visualisation Interactive** : Affichage cartographique des données minières avec coordonnées (x, y, z) et pourcentages de teneur
- **Prédiction Intelligente** : Implémentation de modèles de machine learning pour la prédiction des teneurs 
- **Interface Utilisateur Optimisée** : Expérience utilisateur intuitive et réactive
- **Sécurité Renforcée** : Gestion sécurisée des données et protection contre les menaces

## Fonctionnalités de Sécurité

- **Validation des Inputs** : Surveillance et validation rigoureuse de toutes les entrées utilisateur pour prévenir l'injection de code malveillant
- **Configuration CORS** : Politique de sécurité restrictive avec :
  - Méthodes HTTP autorisées : GET et POST uniquement
  - Origines autorisées : uniquement l'URL du frontend de l'application
- **Clustering Cartographique** : Implémentation de clustering pour optimiser l'affichage des points de données et éviter la surcharge visuelle sur la carte

## Stack Technique

- **Backend** : FastAPI - Framework Python moderne et haute performance
- **Frontend** : React - Bibliothèque JavaScript pour interfaces utilisateur dynamiques
- **Base de Données** : PostgreSQL - Système de gestion de base de données relationnelle robuste
- **Partie Machine Learning** :

## Structure du Projet
│
├─ backend/ 
│ ├─ app/
│ │ ├─ pycache/ 
│ │ ├─ models.py/ # Définition des modèles 
│ │ ├─ routers.py/ # Endpoints FastAPI
│ │ ├─ services.py/ # La logique métier et les opérations sur les données,
│ │ ├─ init.py
│ │ ├─ database.py # Configuration et connexion à PostgreSQL
│ │ ├─ data.py # Script pour charger les données CSV dans la DB
│ │ └─ main.py # Point d'entrée de l'application FastAPI
│ │
│ ├─ data/ # Données CSV d'entrée
│ ├─ ml/
│ │ ├─ predict.ipynb # Notebook pour prédictions et tests ML
│ │ └─ model.pkl # Modèle ML pré-entraîné
│ │
│ ├─ venv/ 
│ ├─ Dockerfile 
│ └─ requirements.txt # Dépendances Python
│
├─ frontend/ # Frontend React
├─ Docker-compose #Pour orchestrer et lancer facilement tous les conteneurs 
├─ .gitignore 
└─ README.md 





## Lancement du Projet

Avant de démarrer l'application, assurez-vous que toutes les prérequis sont installés et configurés correctement.

### Prérequis

- **Docker** et **Docker Compose** installés sur votre machine
- **PostgreSQL** configuré et accessible
- Python 3.10+ (pour le backend si vous voulez exécuter des scripts localement)

---

### Création de la Base de Données PostgreSQL

Vous pouvez créer la base de données et l'utilisateur PostgreSQL nécessaires avec les commandes suivantes :

```sql
-- Connexion à PostgreSQL en tant que superutilisateur
psql -U postgres

-- Création de la base de données
CREATE DATABASE forga_db;

-- Création de l'utilisateur
CREATE USER gsmi_admin WITH PASSWORD '123';

-- Attribution des privilèges sur la base de données
GRANT ALL PRIVILEGES ON DATABASE forga_db TO gsmi_admin;

-- Attribution des privilèges sur le schéma public
GRANT ALL PRIVILEGES ON SCHEMA public TO gsmi_admin;

-- Changer le propriétaire du schéma public
ALTER SCHEMA public OWNER TO gsmi_admin;

-- Définir les privilèges par défaut pour les futures tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO gsmi_admin;
```


### Chargement des Données Initiales

Pour insérer les données CSV dans la base de données :

```bash
cd backend
python -m app.data
```

## Lancement via Docker Compose

Le projet est entièrement conteneurisé avec Docker. Pour lancer tous les services (backend, frontend) :

```bash
docker-compose up --build #Puis acceder a : http://localhost:3000/
docker-compose up -d #Pour exécuter les conteneurs en arrière-plan
docker-compose down #Pour arrêter et supprimer tous les conteneurs


```
## Endpoints API

Le backend FastAPI expose plusieurs endpoints pour interagir avec les données minières et les prédictions.  
Vous pouvez tester les endpoints en accédant à : [http://localhost:8000/docs](http://localhost:8000/docs)  

| Endpoint        | Méthode | Description                                   |
|-----------------|---------|-----------------------------------------------|
| `/data`         | GET     | Récupère toutes les données de forage       |
| `/predict`      | POST    | Prédit la teneur en fonction des données fournies |


## Améliorations et Fonctionnalités Futures

- **Intégration du Deep Learning** : Utiliser des modèles plus avancés pour améliorer la précision des prédictions de teneurs minières.  
- **Visualisation 3D** : Implémenter une carte 3D interactive pour une meilleure représentation des données spatiales.  
- **Déploiement Kubernetes** : Passer à un déploiement scalable et résilient avec Kubernetes pour un accès en production plus robuste.  
- **Optimisation ML et Backend** : Réduction du temps de calcul et amélioration des performances de l’API.  
- **Extension des données** : Ajouter de nouvelles sources et types de données pour enrichir les analyses.  

---

**Développé par :** Randa EL MAAZOUZA  
**Dans le cadre de l’évaluation technique pour le poste Ingénieur Logiciel et IA**
