# Cambios de Sanity que se aplican después de desplegar `seo/mejoras-keywords`

Enlazan a páginas que llegan con este despliegue (`/recursos/matriz-de-polivalencia/`
y `/recursos/plantilla-gestion-documental-prl/`, esta última de la PR anterior). Si se
aplican antes, publican enlaces rotos.

Orden, una vez desplegado:

```
node scripts/sanity/aplicar-cambios.mjs scripts/sanity/cambios-2026-10-17-plantilla-prl.json --aplicar
node scripts/sanity/aplicar-cambios.mjs scripts/sanity/tras-desplegar-2026-10-21-t5-plan-de-acogida.json --aplicar
node scripts/sanity/aplicar-cambios.mjs scripts/sanity/tras-desplegar-2026-10-21-t3-enlace-polivalencia.json --aplicar
```

(con `SANITY_WRITE_TOKEN` en el entorno; sin `--aplicar` es una simulación).

- **plan-de-acogida**: crea el artículo `/blog/plan-de-acogida-operarios/`. Lleva
  `publishedAt: 2026-10-21`; si se aplica más tarde, cámbialo en /admin/ al día real
  para que salga el aviso de contenido nuevo. Hasta que se aplique, el enlace desde
  `/casos-de-uso/onboarding-operarios/` da 404.
- **enlace-polivalencia**: párrafo con enlace a la matriz de polivalencia en
  `/blog/gestion-competencias-industria/`. Si alguien edita el artículo antes, se salta
  (el script lo avisa) y hay que añadirlo a mano tras la FAQ «¿Se puede llevar una
  matriz de competencias en Excel?».

Ya aplicados el 21-10-2026: t1-marca, t2-competencias, t2b-faq-excel, t4-sop y
t8-longitudes.
