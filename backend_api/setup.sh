echo "Copying Connection Profiles"
cp ../connections/connection*.json ./fabric/ccp/

echo "Enrolling Admins"
node ./setup/enroll_admin.js
