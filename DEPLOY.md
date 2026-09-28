# Deploying DiagramaV alongside curiousBeagle Remote Experiments Platform


Services are accessible from the subroute: https://exp-remotos-fisica.usm.cl/diagrama-v/

Frontend is hosted from subroute `/diagrama-v/` and api is hosted on `/diagrama-v-api/` both on port 80, via nginx
 reverse's proxy for the curiousBeagle platform. 

## Changelog - DiagramaV

- Renamed backend folder to `BACKEND` for consistency.
- Added cors variable to docker-compose and `server.ts` on the BACKEND.
- `docker-compose`:
    - Added service name for each container. Prefix `dv-` was used. 
    - A custom network named `diagramav-net` was setup to isolate the services. 
    - Port are left assigned by the docker-service for debugging purposes only, as they are not exposed by the server to the internet. To communicate with the reverse proxy, the network is attached to that specific container on the curiousBeagle' services. 
- FRONTEND:
    - `vite.config.ts`: Added `/diagrama-v/` as base for the site route. 
    - Replaced href navigation on `Admin.tsx` and `TeacherPanel.tsx` for React Router's navigate, both on the logout functionality.
    - `main.tsx`: Added basename `/diagrama-v/` to the router. **[TO-DO] This should probably be passed as a env variable along with the `vite.config.ts` value.**

## Changelog - curiousBeagle platform

- The `nginx.conf` for the reverse proxy is modified to add the frontend and api's routes:

```
// Previous values of nginx.conf
        location /diagrama-v/ {
            proxy_pass http://dv-front:80/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        location /diagrama-v-api/ {
            proxy_pass http://dv-api:3000/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
```
- `docker-compose`: Added the `diagramav-net` as an external network and was attached to the reverse proxy container. 


## Deploy 

### On DiagramaV root folder:

1. Build the images: 

```bash
docker compose build
```

2. Start the services: 
```bash
docker compose up -d
```

3. Add the admin user following README.md instructions. 

### On curiousBeagle root folder:

The proxy is currently configured to point directly to the services of DiagramaV so not configuring should be required. 