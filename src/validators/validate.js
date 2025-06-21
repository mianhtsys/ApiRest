function validate(schema, target = 'body'){
    return (req, res, next) => {
        const data = req[target];
        //paso1 verficar que exita datos
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ message: 'No data found' });
        }
        //paso2 validar los datos
        const {error, value} = schema.validate(data, {
            abortEarly: false, // no detenerse en el primer error, mostrar todos los errores 
            stripUnknown: true // para eliminar campos no definidos en el esquema
        });
        //paso3 si hay error retornar el error
        if (error) {
            return res.status(400).json({
                message: `Error de validacion en ${target}`,
                errores: error.details.map(err => err.message)
            });
        }
        //paso4 remplazar el objeto original con datos limpios
        req[target] = value;
        //continuamos
        next();
    }
}

export default validate;
