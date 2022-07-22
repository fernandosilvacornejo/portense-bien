# Portense Bien

Backend y Frontend de aplicacion mobile para premiar a los niños por portarse bien. Construido con React Native.

# Creacion y configuracion de ambiente

```
/setup.py -s ENVIRONMENT -r REGION [--backend] [--seed] [--frontend]
```

# Tests de backend

```
./test.sh TEST_JSON_FILE STAGE
```

# Levantar servidor de frontend

```
expo start --clear
```

# Debugging

Conectar el celular via usb y ejecutar `adb logcat`

En caso de caída inmediata tras iniciar la aplicación, revisar acá: https://github.com/lottie-react-native/lottie-react-native#android-specific-problems
