#!/usr/bin/env bash
# Supprime les écrans d'exemple du template Expo qui deviendraient des onglets/écrans parasites.
# À lancer UNE FOIS depuis la racine du projet : bash cleanup-template.sh
set -e
for f in "app/(tabs)/two.tsx" "app/(tabs)/explore.tsx" "app/modal.tsx" "app/+html.tsx"; do
  if [ -e "$f" ]; then rm -f "$f" && echo "supprimé : $f"; fi
done
echo "Terminé. (Les dossiers components/ constants/ à la racine sont des restes du template : tu peux aussi les supprimer.)"
