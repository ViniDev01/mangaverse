// // src/components/subComponents/Pesquisa.jsx
// import { useEffect, useRef, useState } from "react";

// function Pesquisa({ visivel, lastUpdateList }) {
//     // const [searchValue, setSearchValue] = useState("");
//     // const [filteredResults, setFilteredResults] = useState([]);
//     const [showResults, setShowResults] = useState(false);
//     const boxPesquisaRef = useRef(null);

//     // // Filtra os resultados
//     // useEffect(() => {
//     //     if (searchValue === "") {
//     //         setFilteredResults([]);
//     //         setShowResults(false);
//     //         return;
//     //     }

//     //     const value = searchValue.toLowerCase();
//     //     const results = lastUpdateList.filter((item) =>
//     //         item.title.toLowerCase().includes(value)
//     //     );

//     //     setFilteredResults(results);
//     //     setShowResults(results.length > 0);
//     // }, [searchValue, lastUpdateList]);

//     // Fecha a caixa de resultados ao clicar fora
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (boxPesquisaRef.current && !boxPesquisaRef.current.contains(event.target)) {
//                 setShowResults(false);
//             }
//         };

//         document.addEventListener("click", handleClickOutside);
//         return () => {
//             document.removeEventListener("click", handleClickOutside);
//         };
//     }, []);

//     return (
//         <>
//             {visivel && (
//                 <div className="container-pesquisa">
//                     <div className="input-pesquisa">
//                         <input
//                             type="text"
//                             id="pesq"
//                             value={searchValue}
//                             onChange={(e) => setSearchValue(e.target.value)}
//                             placeholder="Buscar..."
//                         />
//                         <button>Buscar</button>
//                     </div>

//                     {{showResults && (
//                         <div className="box-pesquisa" ref={boxPesquisaRef}>
//                             {filteredResults.map((item) => (
//                                 <a key={item.id} href={`/page-item-detail/${item.title.replace(/\s+/g, "-")}`} style={{ textDecoration: 'none' }}>
//                                     <div className="box">
//                                         <img src={(`../../img/${item.image}`)} alt={item.title} />
//                                         <div className="info-box-pesquisa">
//                                             <h1>{item.title}</h1>
//                                             <p>{item.description}</p>
//                                         </div>
//                                     </div>
//                                 </a>
//                             ))}
//                         </div>
//                     )}}
//                 </div>
//             )}
//         </>
//     );
// }

// export default Pesquisa;


