const displayKshCurrency = (num) =>{
    const formatteredNumber = new Intl.NumberFormat('en-US',{
        
        maximumFractionDigits : 2,
        minimumFractionDigits : 2

    }).format(num)
    return `Ksh ${formatteredNumber}`

}

export default displayKshCurrency