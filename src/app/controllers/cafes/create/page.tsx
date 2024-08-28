"use client"

import { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CafeService, { ICity } from '@/services/CafeService';
import { AppContext } from '@/state/AppContext';
import { ICafe } from '@/domain/ICafe';

export default function Create() {
    const router = useRouter();
    const context = useContext(AppContext);

    if (!context || !context.userInfo) {
        return <div>User info is not available</div>;
    }

    const { userInfo } = context;

    const [cities, setCities] = useState<ICity[]>([]);
    const [cafeName, setCafeName] = useState("");
    const [cafeAddress, setCafeAddress] = useState("");
    const [cafeEmail, setCafeEmail] = useState("");
    const [cafeTelephone, setCafeTelephone] = useState("");
    const [cafeWebsiteLink, setCafeWebsiteLink] = useState("");
    const [cafeAverageRating, setCafeAverageRating] = useState<number | "">("");
    const [photoLink, setPhotoLink] = useState("");
    const [cityId, setCityId] = useState("");
    const [validationError, setValidationError] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                const fetchedCities = await CafeService.getCities();
                setCities(fetchedCities);

            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        loadData();
    }, []);

    const validateAndCreate = async () => {
        if (!cafeName || !cafeAddress || !cafeEmail || !cafeTelephone || !cityId) {
            setValidationError("Name, address, email, telephone, and city must be set!");
            return;
        }

        setValidationError("");

        const cafeData: ICafe = {
            cafeName,
            cafeAddress,
            cafeEmail,
            cafeTelephone,
            cafeWebsiteLink,
            cafeAverageRating: Number(cafeAverageRating),
            photoLink,
            cityId,
            appUserId: userInfo.userId!
        };

        try {
            const result = await CafeService.create(cafeData, userInfo.jwt);
            if (result.data) {
                router.push("/controllers/cafes/");
            } else if (result.errors) {
                setValidationError(result.errors.join(", "));
            }
        } catch (error) {
            setValidationError("Cafe creation failed. Please try again later.");
        }
    };

    const handleRatingInsert = (value: string) => {
        const num = Number(value);
        if (value === "") {
            setCafeAverageRating("");
            setValidationError("");
        } else if (num > 0 && num <= 10) {
            setCafeAverageRating(num);
            setValidationError("");
        } else {
            setValidationError("Rating should be > 0 and <= 10");
        }
    };

    return (
        <>
            <h1>Create cafe</h1>
            <hr />

            <div className="row">
                <div className="col-md-4">
                    <div className="text-danger" role="alert">{validationError}</div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="CafeName">Cafe Name</label>
                        <input className="form-control" type="text" id="CafeName" name="CafeName" value={cafeName} onChange={(e) => setCafeName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="CafeAddress">Cafe Address</label>
                        <input className="form-control" type="text" id="CafeAddress" name="CafeAddress" value={cafeAddress} onChange={(e) => setCafeAddress(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="CafeEmail">Cafe Email</label>
                        <input className="form-control" type="text" id="CafeEmail" name="CafeEmail" value={cafeEmail} onChange={(e) => setCafeEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="CafeTelephone">Cafe Telephone</label>
                        <input className="form-control" type="text" id="CafeTelephone" name="CafeTelephone" value={cafeTelephone} onChange={(e) => setCafeTelephone(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="CafeWebsiteLink">Cafe Website Link</label>
                        <input className="form-control" type="text" id="CafeWebsiteLink" name="CafeWebsiteLink" value={cafeWebsiteLink} onChange={(e) => setCafeWebsiteLink(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="CafeAverageRating">Cafe Average Rating</label>
                        <input className="form-control" type="text" id="CafeAverageRating" name="CafeAverageRating" value={cafeAverageRating} onChange={(e) => handleRatingInsert(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="PhotoLink">Photo Link</label>
                        <input className="form-control" type="text" id="PhotoLink" name="PhotoLink" value={photoLink} onChange={(e) => setPhotoLink(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="CityId">City</label>
                        <select className="form-control" id="CityId" name="CityId" value={cityId} onChange={(e) => setCityId(e.target.value)}>
                            <option value="">-- Select a city --</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>{city.cityName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <button onClick={(e) => validateAndCreate()} type="submit" className="btn btn-primary" value="Create">Create</button>
                    </div>
                </div>
            </div>

            <div>
                <button onClick={() => router.back()} className="btn btn-secondary">Back to cafes list</button>
            </div>
        </>
    );
}









// "use client"

// import {useState, useContext, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import CafeService, { ICity } from '@/services/CafeService';
// import { AppContext } from '@/state/AppContext';
// import { ICafe } from '@/domain/ICafe';
// import { ICategoryOfCafe } from '@/domain/ICategoryOfCafe';
// import { ICafeCategory } from '@/domain/ICafeCategory';
// import CafeCategoryService from '@/services/CafeCategoryService';
// import CategoryOfCafeService from '@/services/CategoryOfCafeService';


// export default function Create() {
//     const router = useRouter();
//     const context = useContext(AppContext);

//     if (!context || !context.userInfo) {
//         // Handle the case when userInfo is not available
//         return <div>User info is not available</div>;
//     }

//     const { userInfo } = context;

//     if (!userInfo.userId) {
//         // Handle the case when userId is not available
//         return <div>User ID is not available</div>;
//     }

//     const[cities, setCities] = useState<ICity[]>([]);
//     const[cafeName, setCafeName] = useState("");
//     const[cafeAddress, setCafeAddress] = useState("");
//     const[cafeEmail, setCafeEmail] = useState("");
//     const[cafeTelephone, setCafeTelephone] = useState("");
//     const[cafeWebsiteLink, setCafeWebsiteLink] = useState("");
//     const[cafeAverageRating, setCafeAverageRating] = useState("");
//     const [photoLink, setPhotoLink] = useState("");
//     const[cityId, setCityId] = useState("");
//     const [validationError, setvalidationError] = useState("");
//     const [categoriesOfCafe, setCategoriesOfCafe] = useState<ICategoryOfCafe[]>([]);
//     // const[cafeCategories, setCafeCategories] = useState<ICafeCategory[]>([]);
//     const [selectedCategories, setSelectedCategories] = useState<string[]>([]);


//     useEffect(() => {
//         // Fetch cities when the component mounts
//         const loadData = async () => {
//             try {
//                 const fetchedCities = await CafeService.getCities();
//                 setCities(fetchedCities);

//                 const categoriesOfCafeResponse = await CategoryOfCafeService.getAll();
//                 if(categoriesOfCafeResponse && Array.isArray(categoriesOfCafeResponse.data)){
//                     setCategoriesOfCafe(categoriesOfCafeResponse.data);
//                 }else{
//                     setCategoriesOfCafe([]);
//                 }


//             } catch (error) {
//                 console.error("Failed to fetch cities:", error);
//             }
//         };

//         loadData();
//     }, []);

//     const handleCategoryChange = (categoryId: string) => {
//         setSelectedCategories(prevSelected => {
//             if (prevSelected.includes(categoryId)) {
//                 return prevSelected.filter(id => id !== categoryId);
//             } else {
//                 return [...prevSelected, categoryId];
//             }
//         });
//     };


//     const validateAndCreate = async() => {
//         if(!cafeName || !cafeAddress || !cafeEmail || !cafeTelephone || !cityId){
//             setvalidationError("Name, address, email, telephone and city must be set!");
//             return;
//         }

//         setvalidationError("");

//         const cafeData: ICafe = {
//             cafeName,
//             cafeAddress,
//             cafeEmail,
//             cafeTelephone,
//             cafeWebsiteLink,
//             cafeAverageRating: Number(cafeAverageRating),
//             photoLink,
//             cityId,
//             appUserId: userInfo.userId! // Send userId with cafe data
//         };
    
//         try {
//             const result = await CafeService.create(cafeData, userInfo.jwt);
//             if (result.data) {
//                 await Promise.all(
//                     selectedCategories.map(categoryId => 
//                         CafeCategoryService.create({
//                             cafeId: result.data!.id!,
//                             categoryOfCafeId: categoryId
//                         }, userInfo.jwt)
//                     )
//                 );
//                 router.push("/controllers/cafes/")
            
//             } else if (result.errors) {
//                 setvalidationError(result.errors.join(", "));
//             }
//         } catch (error) {
//             setvalidationError("Cafe creation failed. Please try again later.");
//         }
//     }

//     // const getCategoryName = (categoryId: string) => {
//     //     const category = categoriesOfCafe.find(c => c.id === categoryId);
//     //     return category ? category.categoryOfCafeName : 'Unknown';
//     // };


//     return(
     
//         <>  
//         <h1>Create cafe</h1>
//         <hr />
        
//         <div className="row">
//             <div className="col-md-4">
//             <div className="text-danger" role="alert">{validationError}</div>
//                     <div className="form-group">
//                         <label className="control-label" htmlFor="CafeName">Cafe Name</label>
//                         <input className="form-control" type="text" id="CafeName" name="CafeName" value={cafeName} onChange={(e) => setCafeName(e.target.value)} />
//                     </div>
//                     <div className="form-group">
//                         <label className="control-label" htmlFor="CafeAddress">Cafe Address</label>
//                         <input className="form-control" type="text" id="CafeAddress" name="CafeAddress" value={cafeAddress} onChange={(e) => setCafeAddress(e.target.value)} />
//                     </div>
//                     <div className="form-group">
//                         <label className="control-label" htmlFor="CafeEmail">Cafe Email</label>
//                         <input className="form-control" type="text" id="CafeEmail" name="CafeEmail" value={cafeEmail} onChange={(e) => setCafeEmail(e.target.value)} />
//                     </div>
//                     <div className="form-group">
//                         <label className="control-label" htmlFor="CafeTelephone">Cafe Telephone</label>
//                         <input className="form-control" type="text" id="CafeTelephone" name="CafeTelephone" value={cafeTelephone} onChange={(e) => setCafeTelephone(e.target.value)} />
//                     </div>
//                     <div className="form-group">
//                         <label className="control-label" htmlFor="CafeWebsiteLink">Cafe WebsiteLink</label>
//                         <input className="form-control" type="text" id="CafeWebsiteLink" name="CafeWebsiteLink" value={cafeWebsiteLink} onChange={(e) => setCafeWebsiteLink(e.target.value)} />
//                     </div>
//                     <div className="form-group">
//                         <label className="control-label" htmlFor="CafeAverageRating">Cafe Average Rating</label>
//                         <input className="form-control" type="text" id="CafeAverageRating" name="CafeAverageRating" value={cafeAverageRating} onChange={(e) => setCafeAverageRating(e.target.value)} />
//                     </div>
//                     <div className="form-group">
//                         <label className="control-label" htmlFor="PhotoLink">Photo Link</label>
//                         <input className="form-control" type="text" id="PhotoLink" name="PhotoLink" value={photoLink} onChange={(e) => setPhotoLink(e.target.value)} />
//                     </div>
//                     <div className="form-group">
//                         <label className="control-label" htmlFor="CityId">City</label>
//                         <select className="form-control" id="CityId" name="CityId" value={cityId} onChange={(e) => setCityId(e.target.value)}>
//                             <option value="">-- Select a city --</option>
//                             {cities.map(city => (
//                                 <option key={city.id} value={city.id}>{city.cityName}</option>
//                             ))}
//                         </select>
//                     </div>
//                     <div className="form-group">
//                         <label className="control-label" htmlFor="CategoryOfCafe">Categories of Cafe</label>
//                         {categoriesOfCafe.map(category => (
//                             <div key={category.id} className="form-check">
//                                 <input 
//                                     type="checkbox" 
//                                     className="form-check-input" 
//                                     id={`category-${category.id}`} 
//                                     checked={selectedCategories.includes(category.id!)} 
//                                     onChange={() => handleCategoryChange(category.id!)} 
//                                 />
//                                 <label className="form-check-label" htmlFor={`category-${category.id}`}>
//                                     {category.categoryOfCafeName}
//                                 </label>
//                             </div>
//                         ))}
//                     </div>
                    
//                     <div className="form-group">
//                         <button onClick={(e) => validateAndCreate()} type="submit" className="btn btn-primary" value="Create">Create</button>
//                     </div>
//             </div>
//         </div>

// <div>
   
//     <Link href="../cafes">Back to List</Link>
// </div>
// </>

//  );}

 
