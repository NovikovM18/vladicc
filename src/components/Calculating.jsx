import { useState } from "react"; 
import { Card, CardContent, FormLabel, Input, Button, Select, MenuItem, Stack } from "@mui/material"; 
import { PieChart, Pie, Cell } from "recharts"; 
 
const COLORS = ["#62C9BE", "#e2e8f0", "#4CAF50"]; // Три кольори для спроб 
 
function calculateBaseSuccess(age, bmi, cycles, pregnancies, diagnosis, eggType) { 
  let success = age < 35 ? 0.6 : 0.4; 
  if (bmi < 18.5) success *= 0.8; 
  else if (bmi > 30) success *= 0.7; 
  success *= 1 - 0.05 * cycles; 
  if (pregnancies > 0) success *= 1.1; 
 
  const diagnosisMultipliers = { 
    "male": 0.8, 
    "endometriosis": 0.7, 
    "tubal": 0.6, 
    "ovulatory": 0.85, 
    "diminished": 0.6, 
    "uterine": 0.65, 
    "unexplained": 0.75, 
    "other": 1 
  }; 
 
  success *= diagnosisMultipliers[diagnosis] || 1; 
  if (eggType === "donor") success *= 1.2; 
  return Math.min(Math.max(success, 0), 1); 
} 
 
export default function IVFCalculator() { 
  const [age, setAge] = useState(""); 
  const [weight, setWeight] = useState(""); 
  const [height, setHeight] = useState(""); 
  const [cycles, setCycles] = useState(0); 
  const [pregnancies, setPregnancies] = useState(0); 
  const [diagnosis, setDiagnosis] = useState("unexplained"); 
  const [eggType, setEggType] = useState("own"); 
  const [showResults, setShowResults] = useState(false); 
  const [selectedAttempt, setSelectedAttempt] = useState(1); // Для вибору кількості спроб 
 
  const bmi = weight / (height / 100) ** 2; 
  const base = calculateBaseSuccess(age, bmi, cycles, pregnancies, diagnosis, eggType); 
 
  const attempts = [ 
    { n: 1, rate: 1 - (1 - base) ** 1 }, 
    { n: 2, rate: 1 - (1 - base) ** 2 }, 
    { n: 3, rate: 1 - (1 - base) ** 3 }, 
  ]; 
 
  const handleClickAttempt = (attemptNumber) => { 
    setSelectedAttempt(attemptNumber); 
  }; 
 
  return ( 
    <div className="max-w-3xl mx-auto p-4"> 
      <h1 className="text-3xl font-bold text-[#62C9BE] mb-6">Калькулятор успішності ЕКЗ</h1> 
      <div className="form"> 
        <div> 
          <FormLabel>Вік</FormLabel> 
          <Input 
            type="number" 
            value={age} 
            onChange={(e) => setAge(e.target.value)} 
            placeholder="Введіть ваш вік" 
            className="w-full p-2 rounded border mb-4" 
          /> 
        </div> 
        <div> 
          <FormLabel>Вага (кг)</FormLabel> 
          <Input 
            type="number" 
            value={weight} 
            onChange={(e) => setWeight(e.target.value)} 
            placeholder="Введіть вашу вагу" 
            className="w-full p-2 rounded border mb-4" 
          /> 
        </div> 
        <div> 
          <FormLabel>Зріст (см)</FormLabel> 
          <Input 
            type="number" 
            value={height} 
            onChange={(e) => setHeight(e.target.value)} 
            placeholder="Введіть ваш зріст" 
            className="w-full p-2 rounded border mb-4" 
          /> 
        </div> 
        <div> 
          <FormLabel>Кількість попередніх циклів ЕКЗ</FormLabel> 
          <Input 
            type="number" 
            value={cycles} 
            onChange={(e) => setCycles(+e.target.value)} 
            placeholder="Кількість циклів" 
            className="w-full p-2 rounded border mb-4" 
          /> 
        </div> 
        <div> 
          <FormLabel>Попередні вагітності</FormLabel> 
          <Input 
            type="number" 
            value={pregnancies} 
            onChange={(e) => setPregnancies(+e.target.value)} 
            placeholder="Кількість вагітностей" 
            className="w-full p-2 rounded border mb-4" 
          /> 
        </div> 
        <div> 
          <FormLabel>Діагноз</FormLabel> 
          <Select 
            value={diagnosis} 
            onChange={(e) => setDiagnosis(e.target.value)} 
            className="w-full p-2 mb-4 border rounded" 
          > 
            <MenuItem value="male">Чоловічий фактор</MenuItem> 
            <MenuItem value="endometriosis">Ендометріоз</MenuItem> 
            <MenuItem value="tubal">Проблеми з трубами</MenuItem>

            <MenuItem value="ovulatory">Овуляторні порушення</MenuItem> 
            <MenuItem value="diminished">Знижений оваріальний резерв</MenuItem> 
            <MenuItem value="uterine">Матковий фактор</MenuItem> 
            <MenuItem value="unexplained">Неясне безпліддя</MenuItem> 
            <MenuItem value="other">Інше</MenuItem> 
          </Select> 
        </div> 
        <div> 
          <FormLabel>Тип яйцеклітин</FormLabel> 
          <Select 
            value={eggType} 
            onChange={(e) => setEggType(e.target.value)} 
            className="w-full p-2 mb-4 border rounded" 
          > 
            <MenuItem value="own">Власні</MenuItem> 
            <MenuItem value="donor">Донорські</MenuItem> 
          </Select> 
        </div> 
        <Button 
          className="mt-4 bg-[#62C9BE] text-white px-6 py-2 rounded" 
          onClick={() => setShowResults(true)} 
        > 
          Розрахувати успішність 
        </Button> 
      </div> 
 
      {showResults && ( 
        <div className="mt-6"> 
          <Stack direction="row" spacing={4} justifyContent="center"> 
            {attempts.slice(0, selectedAttempt).map((a, index) => ( 
              <Card key={a.n} className="mb-6"> 
                <CardContent className="flex flex-col items-center justify-center p-6"> 
                  <PieChart width={200} height={200}> 
                    <Pie 
                      dataKey="value" 
                      data={[{ value: a.rate }, { value: 1 - a.rate }]} 
                      innerRadius={70} 
                      outerRadius={100} 
                      startAngle={90} 
                      endAngle={450} 
                    > 
                      <Cell fill={COLORS[index]} /> 
                    </Pie> 
                  </PieChart> 
                  <p className="text-xl font-semibold mt-4 text-[#62C9BE]"> 
                    {Math.round(a.rate * 100)}% 
                  </p> 
                  <p className="text-sm text-center mt-2"> 
                    Імовірність народження дитини після {a.n} спроб(и) ЕКЗ 
                    протягом року 
                  </p> 
                </CardContent> 
              </Card> 
            ))} 
          </Stack> 
          <div className="mt-6 flex justify-center space-x-4"> 
            <Button 
              variant="contained" 
              onClick={() => handleClickAttempt(1)} 
              className="bg-[#62C9BE] text-white" 
            > 
              1 спроба 
            </Button> 
            <Button 
              variant="contained" 
              onClick={() => handleClickAttempt(2)} 
              className="bg-[#62C9BE] text-white" 
            > 
              2 спроби 
            </Button> 
            <Button 
              variant="contained" 
              onClick={() => handleClickAttempt(3)} 
              className="bg-[#62C9BE] text-white" 
            > 
              3 спроби 
            </Button> 
          </div> 
        </div> 
      )} 
    </div> 
  ); 
}