document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-card"); //to populate cards from js dynamically



    //validating username return true or false on regular exp

    function validateUsername(username){
        if(username.trim()===""){
            alert("Username should not be empty");
            return false;
        }
        const regex = /^(?![-_])[a-zA-Z0-9-_]{4,15}(?<![-_])$/; 
        
        //this is the regular exp of leet code username we will match this format with the username we got from the user.

        const isMatching=regex.test(username);

        if(isMatching==false){
            alert("Invalid Username")
        }
        return isMatching;
    }

    //calling the api thats why async function

    async function fetchUserDetails(username) {

        const url = `https://leetcode-stats-api.herokuapp.com/${username}` //calling the api from leet code
        try{
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            const response = await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch the user details");
                
            }
            const parsedData = await response.json();
            console.log("Logging data: ",parsedData);
            displayUserData(parsedData);
        }
        catch(error){
            statsContainer.innerHTML=`<p>No data found</p>`
        }
        finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }

    }
    //populate in os
    function updateProgress(solved,total,label,circle){
        const progressDegree=(solved/total)*100;
        circle.style.setProperty("--progress-degree",`${progressDegree}%`);
        label.textContent=`${solved}/${total}`;


    }







    //Getting all the data from api and storing it to diffrent variables        
    function displayUserData(parsedData){
        const totalQues = parsedData.totalQuestions;
        const totalEasyQues =parsedData.totalEasy;
        const totalMediumQues =parsedData.totalMedium;
        const totalHardQues =parsedData.totalHard;

        const solvedTotalQues=parsedData.totalSolved;
        const solvedEasyQues=parsedData.easySolved;
        const solvedMediumQues=parsedData.mediumSolved;
        const solvedHardQues=parsedData.hardSolved;

        const rateOfAccep=parsedData.acceptanceRate;
        const rankingg = parsedData.ranking;
        const contribution = parsedData.contributionPoints;
        
        // updateProgress(solvedTotalQues,totalEasyQues,easyLabel,easyProgressCircle);

        updateProgress(solvedEasyQues,totalEasyQues,easyLabel,easyProgressCircle);
        updateProgress(solvedMediumQues,totalMediumQues,mediumLabel,mediumProgressCircle);
        updateProgress(solvedHardQues,totalHardQues,hardLabel,hardProgressCircle);

        const cardsData=[
            {
                label:"Total Question solved",value: solvedTotalQues
            },
            {
                label: "Rate of Acceptance", value: rateOfAccep
            },
            {
                label: "Ranking" , value:rankingg
            },
            {
                label:"Contribution",value: parsedData.contributionPoints
            }
        ];

        console.log("Card ka deta: ", cardsData);


        //populate the ui dinamically
        cardStatsContainer.innerHTML = cardsData.map(
            data => {
                return `
                    <div class="card">
                        <h4>${data.label}</h4>
                        <p>${data.value}</p>
                    </div>
                `;
            }
        ).join(""); // .join("") lagao nahi to `,` dikhega UI me
        


        
    }
    

    searchButton.addEventListener('click',function(){
        const username = usernameInput.value;
        // console.log(username); checking if its working correctly
        if(validateUsername(username)){
            fetchUserDetails(username)

        }

    })
})



