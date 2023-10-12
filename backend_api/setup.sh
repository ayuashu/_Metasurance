echo "Copying Connection Profiles"
cp ../connections/connection*.json ./fabric/ccp/

echo "Running npm install"
# npm install

echo "Enrolling Admins"
node ./setup/enroll_admin.js
