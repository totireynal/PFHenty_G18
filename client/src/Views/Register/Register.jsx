import { React, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { postCompany } from "../../state/redux/actions/actions";
import { CardElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { getCompaniesCuit } from "../../state/redux/actions/actions";
import { getCompaniesEmail } from "../../state/redux/actions/actions";
import { getCompaniesName } from "../../state/redux/actions/actions";
import { getCompaniesTel } from "../../state/redux/actions/actions";
import UploadImage from  "../../Components/Upload/UploadImage"



function validate(input) {
  let errors = {};
  if(input.name === "name"){
    if (/[^A-Za-z0-9 ]+/g.test(input.name)) {
      errors.name = "Nombre no puede tener caracteres especiales o tildes";
    }
  }
  if (input.cuit) {
    if (
      !/^(20|23|27|30|33)([0-9]{9}|-[0-9]{8}-[0-9]{1})$/g.test(input.cuit)
    ) {
      errors.cuit = "Ingrese un formato valido de CUIT";
    }
  }
  if (input.industry) {
    if (/[^A-Za-z0-9 ]+/g.test(input.industry)) {
      errors.industry = "Nombre no puede tener caracteres especiales o tildes";
    }
  }
  if (input.numberEmployees) {
    if (!/^[0-9]+$/.test(input.numberEmployees)) {
      errors.numberEmployees = "Ingrese formato numero";
    }
  }
  if (input.email) {
    if(!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(input.email)){
      errors.email = "Ingrese un email valido";
    }
  }
  return errors;
}

export default function CreateCompany(props) {
  let clientSecret = props.options;
  const stripe = useStripe();
  const elements = useElements();
  const [isCardComplete, setIsCardComplete] = useState(false);
 
  const [mensajeCuit, setMensajeCuit] = useState(null);
  const [mensajeName, setMensajeName] = useState(null);
  const [mensajeEmail, setMensajeEmail] = useState(null);
  const [mensajeTel, setMensajeTel] = useState(null);


  const [message, setMessage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
 

  const dispatch = useDispatch();
  


  const [errors, setErrors] = useState({});
  const [input, setInput] = useState({
    name: "",
    cuit: "",
    industry: "",
    location: "",
    numberEmployees: "",
    tel: "",
    email: "",
    image: "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-541.jpg"
  });


  const handleBlurCUIT = (event) => {

    const cuit = event.target.value;
      dispatch(getCompaniesCuit(cuit)).then(resultado => {
      if (resultado?.message) {
        setMensajeCuit(resultado?.message);
      } else {
        setMensajeCuit(null);
      }
      console.log("Valor", cuit);
      console.log("Mensaje: ", resultado?.message)
    });
    console.log("asdasdasd")
  }

  const handleBlurName = (event) => {

    const name = event.target.value;
      dispatch(getCompaniesName(name)).then(resultado => {
      if (resultado?.message) {
        setMensajeName(resultado?.message);
      } else {
        setMensajeName(null);
      }
      console.log("Valor", name);
      console.log("Mensaje: ", resultado?.message)
    });
  }


  const handleBlurEmail = (event) => {

    const email = event.target.value;
      dispatch(getCompaniesEmail(email)).then(resultado => {
      if (resultado?.message) {
        setMensajeEmail(resultado?.message);
      } else {
        setMensajeEmail(null);
      }
      console.log("Valor", email);
      console.log("Mensaje: ", resultado?.message)
    });
  }

  const handleBlurTel = (event) => {

    const valor = event.target.value;
      dispatch(getCompaniesTel(valor)).then(resultado => {
      if (resultado?.message) {
        setMensajeTel(resultado?.message);
      } else {
        setMensajeTel(null);
      }
      console.log("Valor", valor);
      console.log("Mensaje: ", resultado?.message)
    });
  }

  const handleChangeImage = (url) => {
    setInput({
      ...input,
      image: url,
    });
    console.log(input.image)
  };

  
  const handleSubmit = async (e)=> {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const response = await getCompaniesCuit(input.cuit);
    if(response.data !== "The company PruebaCUIT has been created correctly"){

    };
    
    if (
      !input.name ||
      !input.cuit ||
      !input.industry ||
      !input.numberEmployees ||
      !input.email ||
      !input.tel ||
      !input.location ||
      !input.image
    ) {
      return alert("Complete correctamente el formulario antes de enviarlo");
    }

    setIsProcessing(true);
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      }
    },
  )
  if(error){
    setMessage(error.message);
    } else if(paymentIntent)
    {
      console.log(paymentIntent)
    setMessage("Payment status: succeeded!")
    
    } else {
      setMessage("Unexpected state");
    }

  setIsProcessing(false);

 

    console.log("Input pasado a post: ",input)
    dispatch(postCompany(input));
    console.log(input);
    setInput({
      name: "",
      cuit: "",
      industry: "",
      numberEmployees: "",
      email: "",
      location:"",
      tel:"",
      image:"https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-541.jpg",
    });
    setFormSubmitted(true);
  }

  const handleCardChange = (event) => {
    setIsCardComplete(event.complete);
  };
  function handleChange(e) {
    const {name, value} = e.target;
    setInput({
      ...input,
      [name]: value,
      InformationId:1
    });
    setErrors(
      validate({
        ...input,
        [name]: value,
      })
     );
  }

  return (
    <div className="min-height-full flex h-screen">
      <div className="hidden lg:block relative h-full flex-1 text-6xl">
        <h1>StaffSphere Register Company</h1>
        <div className="text-2xl">
          Simplify your team management for only U$S 2,000
        </div>
      </div>
      <div className="flex-1 flex flex-col py-14 px-4 sm:pax-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-lg lg:w-[100rem]">
          <div className="text-center lg:text-left">
            <h2 className="mt-1 text-3x1 font-extrabold text-gray-900 my-2">
              Register your company
            </h2>
            <h6 className="text-xs text-red-400">(*) Campos necesarios</h6>
          </div>
          <div className="mt-6">
            <form
              action=""
              className="space-y-1"
              onSubmit={(e) => handleSubmit(e)}
            >
              {/* grid grid-cols-1 lg:grid-col-2 lg:gap-3 */}
              <div className="grid lg:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="Name"
                    className="block  text-sm mt-2 lg:mt-0 font-medium text-gray-700"
                  >
                    Name <span className="text-xs text-red-400">(*)</span>
                  </label>
                  <input
                    type="text"
                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-sky-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Name"
                    value={input.name}
                    name="name"
                    onChange={(e) => handleChange(e)}
                    onBlur={(event)=> handleBlurName(event)}
                  />
                  {errors.name && (
                    <section className="m-0 text-red-600">
                      {errors.name}
                    </section>
                  )}
                  {mensajeName && <section className="m-0  text-red-600">{mensajeName}</section>}
                   {console.log("Mensaje en section:", mensajeName)}
                </div>
                <div>
                  <label
                    htmlFor="ID"
                    className="block  text-sm mt-2 lg:mt-0 font-medium text-gray-700"
                  >
                    CUIT <span className="text-xs text-red-400">(*)</span>
                  </label>
                  <input
                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-sky-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="number"
                    value={input.cuit}
                    name="cuit"
                    onChange={(e) => handleChange(e)}
                    placeholder="e.g 30203445606"
                    onBlur={(event)=> handleBlurCUIT(event)}
                  />
                  
                   {errors.cuit && (
                    <section className="m-0  text-red-600">
                      {errors.cuit}
                    </section>
                  )} 
                   {mensajeCuit && <section className="m-0  text-red-600">{mensajeCuit}</section>}
                   {console.log("Mensaje en section:", mensajeCuit)}
                   
                </div>
                <div>
                  <label
                    htmlFor="Industry"
                    className="block  text-sm mt-2 lg:mt-0 font-medium text-gray-700"
                  >
                    Industry <span className="text-xs text-red-400">(*)</span>
                  </label>
                  <input
                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-sky-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    name="industry"
                    value={input.industry}
                    onChange={(e) => handleChange(e)}
                    placeholder="Industry"
                  />
                  {errors.industry && (
                    <section className="m-0  text-red-600">
                      {errors.industry}
                    </section>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="Location"
                    className="block  text-sm mt-2 lg:mt-0 font-medium text-gray-700"
                  >
                    Location <span className="text-xs text-red-400">(*)</span>
                  </label>
                  <input
                    type="text"
                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-sky-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Location"
                    value={input.location}
                    name="location"
                    onChange={(e) => handleChange(e)}
                  />
                  {errors.location && (
                    <section className="m-0  text-red-600">
                      {errors.location}
                    </section>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="numberEmployees"
                    className="block  text-sm mt-2 lg:mt-0 font-medium text-gray-700"
                  >
                    Number of employees <span className="text-xs text-red-400">(*)</span>
                  </label>
                  <input
                    type="number"
                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-sky-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Number of employees"
                    value={input.numberEmployees}
                    name="numberEmployees"
                    onChange={(e) => handleChange(e)}
                  />
                  {errors.numberEmployees && (
                    <section className="m-0  text-red-600">
                      {errors.numberEmployees}
                    </section>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="Tel"
                    className="block  text-sm mt-2 lg:mt-0 font-medium text-gray-700"
                  >
                    Phone <span className="text-xs text-red-400">(*)</span>
                  </label>
                  <input
                    type="number"
                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-sky-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Phone"
                    value={input.tel}
                    name="tel"
                    onChange={(e) => handleChange(e)}
                    onBlur={(event)=> handleBlurTel(event)}
                  />
                  {errors.tel && (
                    <section className="m-0  text-red-600">
                      {errors.tel}
                    </section>
                  )}
                  {mensajeTel && <section className="m-0  text-red-600">{mensajeTel}</section>}
                   {console.log("Mensaje en section:", mensajeTel)}
                </div>
                <div>
                  <label
                    htmlFor="Email"
                    className="block  text-sm mt-2 lg:mt-0 font-medium text-gray-700"
                  >
                    Email <span className="text-xs text-red-400">(*)</span>
                  </label>
                  <input
                    type="email"
                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-sky-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Email"
                    value={input.email}
                    name="email"
                    onChange={(e) => handleChange(e)}
                    onBlur={(event)=> handleBlurEmail(event)}
                  />
                  {errors.email && (
                    <section className="m-0  text-red-600">
                      {errors.email}
                    </section>
                  )}
                  {mensajeEmail && <section className="m-0  text-red-600">{mensajeEmail}</section>}
                   {console.log("Mensaje en section:", mensajeEmail)}
                </div>
                <div>
                  <div className="flex flex-row w-60">
                    <UploadImage handleChangeImage={handleChangeImage} />
                    <img
                    src={input.image}
                    alt="profilepic"
                    className="rounded-md border-none shadow-none text-transparent w-auto h-10 object-cover"
                    />
                </div>
                  {/* <label
                    htmlFor="Email"
                    className="block  text-sm mt-2 lg:mt-0 font-medium text-gray-700"
                  >
                    Image <span className="text-xs text-red-400">(*)</span>
                  </label>
                  <input
                    type="image"
                    alt="image"
                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-sky-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Image"
                    value={input.image}
                    name="image"
                    onChange={(e) => handleChange(e)}
                    onBlur={(event)=> handleBlurEmail(event)}
                  />
                  {errors.image && (
                    <section className="m-0  text-red-600">
                      {errors.image}
                    </section>
                  )}
                  {/* {mensajeEmail && <section className="m-0  text-red-600">{mensajeEmail}</section>}
                   {console.log("Mensaje en section:", mensajeEmail)} */} 
                </div>
                </div>
                <div>
                  <label
                    htmlFor="Payment"
                    className="block  text-sm mt-2 lg:mt-0 font-medium text-gray-700"
                  >
                    Payment <span className="text-xs text-red-400">(*)</span>
                  </label>
                  <CardElement id="payment-element"  onChange={handleCardChange}/>
                </div>
              <div>
                <button
                  type="submit"
                  className="m2-2 w-full py-3 bg-sky-700 text-white"
                  disabled={!isCardComplete || isProcessing || !stripe || !elements || !input.name ||!input.cuit || !input.email || !input.tel || !input.location || !input.industry || !input.numberEmployees || mensajeCuit || mensajeName || mensajeEmail|| mensajeTel}
                >
                  {" "}
                  <span>
                    {isProcessing ? "Processing ... " : "Register and pay now"}
                  </span>
                </button>
                 {/* Show any error or success messages */}
                 {/* {message && <div className="mb-4">{message}</div>} */}
              </div>
            </form>
            <div>
              { message && formSubmitted &&
               <div className="fixed z-50 inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
               <div className="bg-white p-8 rounded-lg">
                 <h2 className="text-xl font-bold mb-4">{message} Thank you for trusting us  🎉</h2>
                 <p className="mb-4">We need some additional data to complete the process</p>
                 <div className="flex justify-end">
                   
                   <Link to="/addAreaPositionSA" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Continue</Link>
                 </div>
               </div>
             </div>
          }
            
            
          
                </div>
          </div>
        </div>
      </div>
    </div>
  );
}
