const RegisterForm = () =>{
    <form action="">
        <h1>Registrate!</h1>
        <input type="text" placeholder="Nombre" name="nombre" className="nombre" required/>

        <input type="text" placeholder="Apellido" name="apellido" className="apellido" required />

        <input type="email" placeholder="email" name="email" className="email" required/>

        <input type="text" placeholder="Numero" name="numero" className="numero" required />

    </form>
}

export default RegisterForm