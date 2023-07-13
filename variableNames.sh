#!/bin/bash

# Chemin vers le fichier .env
env_file=".env"

# Lire les variables du fichier .env et les formater
formatted_variables=()
while IFS= read -r line || [[ -n "$line" ]]; do
    # Ignorer les lignes vides ou commentées
    if [[ -n "$line" && "$line" != "#"* ]]; then
        # Extraire le nom de la variable
        variable_name=$(echo "$line" | cut -d'=' -f1)
        # Ajouter le nom de la variable au format demandé
        formatted_variables+=("'$variable_name',")
    fi
done < "$env_file"

# Afficher les noms des variables formatées
echo "["${formatted_variables[@]}"]"
