import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/

// Load VITE_PORT from env value
// https://stackoverflow.com/questions/66389043/how-can-i-use-vite-env-variables-in-vite-config-js
export default ({ mode }) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

    return defineConfig({
        plugins: [react()],

        server: {
            port: parseInt(process.env.VITE_PORT ?? "5173"),
            watch: {
              usePolling: process.env.HOT_POLLING === "true",
            }
        },
    });
}
