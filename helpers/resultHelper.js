const axios = require("axios");
const xml2js = require("xml2js");

const UsaOneAnticash = async (data) => {
  try {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${process.env.IDMERIT_TOKEN}`;
    axios.defaults.headers.common["Content-Type"] =
      "application/x-www-form-urlencoded";
      let urltwo=null
      if(data.yob){
         urltwo = `${process.env.IDMERIT_URL}/us-1/2.1?first_name=${data.first_name}&last_name=${data.last_name}&yob=${data.yob}&city=${data.city}&state=${data.state}&marital_status=${data.marital_status}&request_id=00001`;
      }else{
         urltwo = `${process.env.IDMERIT_URL}/us-1/2.1?first_name=${data.first_name}&last_name=${data.last_name}&city=${data.city}&state=${data.state}&marital_status=${data.marital_status}&request_id=00001`;
      }
    let US1resul = await axios.post(urltwo);
    const { first_name, last_name, city, state, yob, marital_status } =
      US1resul.data.data;
      
    let sendData = {
      first_name: first_name?.result == "Match" ? "match" :  first_name?.result == "Partial Match"?"partial":"no_match",
      last_name: last_name?.result == "Match" ? "match" :  last_name?.result == "Partial Match"?"partial":"no_match",
      city: city?.result == "Match" ? "match" :  city?.result == "Partial Match"?"partial":"no_match",
      state: state?.result == "Match" ? "match" :  state?.result == "Partial Match"?"partial":"no_match",
      marital_status:marital_status?.result == "Match" ? "match" :  marital_status?.result == "Partial Match"?"partial":"no_match",
    };
    // if(yob){
    //   sendData.yob= yob?.result == "Match" ? "match" :  yob?.result == "Partial Match"?"partial":"no_match"
    // }
    return sendData;
  } catch (error) {
    let sendData = {
      first_name: "no_match",
      last_name:  "no_match",
      city: "no_match",
      state: "no_match",
      yob:  "no_match",
      marital_status: "no_match",
    };
    console.log(error);
    return sendData;
  }
};

const CriminalApi = async (data) => {
  try {
    let xmlBodyStr = `
    <StatewideCriminalNameSearchRequestElement>
    <Session>
     <Account>${process.env.CRIMINAL_USERNAME}</Account>
     <Key>${process.env.CRIMINAL_PASSWORD}</Key>
     <ReferenceID></ReferenceID>
      <SearchType>ncaoc</SearchType>
    </Session>
    <StateWideCriminalNameSearchParameters>
      <BeginYear></BeginYear>
      <CaseType>C</CaseType>
      <CompanyName></CompanyName>
      <County></County>
      <DOB></DOB>
      <EndYear></EndYear>
      <LastName>${data.last_name}</LastName>
      <MiddleName></MiddleName>
      <Race></Race>
      <RowCount2>1000</RowCount2>
      <Sex></Sex>
    </StateWideCriminalNameSearchParameters>
 </StatewideCriminalNameSearchRequestElement>`;
    var config = {
      headers: { "Content-Type": "text/xml" },
    };
    let criminaldata = await axios.post(
      process.env.CRIMINAL_API_LINK,
      xmlBodyStr,
      config
    );
    let senddata = null;
    xml2js.parseString(criminaldata.data, (err, result) => {
      if (err) {
        throw err;
      }
      senddata = result;
    });

    let datafetchedData =
      senddata.StateWideCriminalNameSearchResults.StateWideCriminalNameSearchResult?.map(
        (w) => {
          if (w.Error[0] == "") {
            return {
              Status: true,
              City:
                typeof w.City[0] == "object" && w.City[0] !== null
                  ? ""
                  : w.City[0],
              County:
                typeof w.County[0] == "object" && w.County[0] !== null
                  ? ""
                  : w.County[0],
              CourtRoom:
                typeof w.CourtRoom[0] == "object" && w.CourtRoom[0] !== null
                  ? ""
                  : w.CourtRoom[0],
              DefendantName:
                typeof w.DefendantName[0] == "object" &&
                w.DefendantName[0] !== null
                  ? ""
                  : w.DefendantName[0],
              FileNumber:
                typeof w.FileNumber[0] == "object" && w.FileNumber[0] !== null
                  ? ""
                  : w.FileNumber[0],
              OffenseDescription:
                typeof w.OffenseDescription[0] == "object" &&
                w.OffenseDescription[0] !== null
                  ? ""
                  : w.OffenseDescription[0],
              OffenseNumber:
                typeof w.OffenseNumber[0] == "object" &&
                w.OffenseNumber[0] !== null
                  ? ""
                  : w.OffenseNumber[0],
              OffenseStatus:
                typeof w.OffenseStatus[0] == "object" &&
                w.OffenseStatus[0] !== null
                  ? ""
                  : w.OffenseStatus[0],
              OffenseType:
                typeof w.OffenseType[0] == "object" && w.OffenseType[0] !== null
                  ? ""
                  : w.OffenseType[0],
              TrialDate:
                typeof w.TrialDate[0] == "object" && w.TrialDate[0] !== null
                  ? ""
                  : w.TrialDate[0],
              DOB:
                typeof w.DOB[0] == "object" && w.DOB[0] !== null
                  ? ""
                  : data.yob || '',
            };
          } else {
            return {
              Status: false,
              City: data.city,
              County: "",
              CourtRoom: "",
              DefendantName: `${data.first_name} ${data.last_name}`,
              FileNumber: "",
              OffenseDescription: "",
              OffenseNumber: "",
              OffenseStatus: "",
              OffenseType: "",
              TrialDate: "",
              DOB: "",
            };
          }
        }
      );
      // console.log(datafetchedData)
    let singleData = null;
    datafetchedData?.map((w) => {
      if (w.Status ) {
        let date = null
        if(w?.DOB !==''){
          date = new Date(Number(w?.DOB));
        }
        let  year = null
        if(date !==null){
          year = date?.getFullYear();
        }
        if (data?.yob) {
          if (
            year == Number(data?.yob) &&
            w?.City?.toLowerCase().includes(data?.city.toLowerCase())
          ) {
            singleData = w;
          }
        } else {
         
          if (w.City.toLowerCase().includes(data.city.toLowerCase())) {
          
            singleData = w;
          }
        }
      }
    });
    if (singleData == null) {
      singleData = {
        Status: false,
        City: data.city,
        County: "",
        CourtRoom: "",
        DefendantName: `${data.first_name} ${data.last_name}`,
        FileNumber: "",
        OffenseDescription: "",
        OffenseNumber: "",
        OffenseStatus: "",
        OffenseType: "",
        TrialDate: "",
        DOB: "",
      };
    }

    return singleData;
  } catch (error) {
    console.log(error);
    return {
      Status: false,
      City: data.city,
      County: "",
      CourtRoom: "",
      DefendantName: `${data.first_name} ${data.last_name}`,
      FileNumber: "",
      OffenseDescription: "",
      OffenseNumber: "",
      OffenseStatus: "",
      OffenseType: "",
      TrialDate: "",
      DOB: "",
    };
    
  }
};

module.exports = {
  UsaOneAnticash,
  CriminalApi,
};
