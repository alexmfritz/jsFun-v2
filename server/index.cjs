// The server file is server/index.cjs, not server/index.ts or server/index.mjs. There are three reasons:

// 1. No build step required. The server runs directly with node server/index.cjs. 
// There is no TypeScript compilation, no bundling, no source maps to manage. 
// For a proof-of-concept deployed on constrained machines, simplicity wins.
// 2. The package.json has "type": "module". 
// This makes all .js files ESM by default. 
// The .cjs extension explicitly opts this file out of ESM, allowing require() syntax.
// 3. Express and bcryptjs have mature CommonJS support. 
// While they work with ESM too, CommonJS avoids edge cases with named exports and default imports that can vary between versions.

'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');