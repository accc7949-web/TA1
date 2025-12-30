
// FIX: Import VocabularyCategory to be used for the legacy CATEGORIES constant.
import { Flashcard, VocabularyPart, GrammarCategory, GrammarTopic, Classroom, Grade, Unit, VocabularyCategory } from './types';


// --- NEW: Green Living Vocabulary ---
const GREEN_LIVING_PART_1: Flashcard[] = [
  { id: 4, word: 'landfill (n)', pronunciation: '/ˈlændfɪl/', meaning: 'bãi rác', examples: ['The map shows the position of the new landfills.'], synonyms: [], antonyms: [] },
  { id: 5, word: 'go green', pronunciation: '', meaning: 'sống xanh', examples: ['Start going green today!'], synonyms: [], antonyms: [] },
  { id: 6, word: 'packaging (n)', pronunciation: '/ˈpækɪdʒɪŋ/', meaning: 'bao bì', examples: ['Attractive packaging can help to sell products.'], synonyms: [], antonyms: [] },
  { id: 7, word: 'container (n)', pronunciation: '/kənˈteɪnə(r)/', meaning: 'thùng, hộp, gói', examples: ['Fill the container with water.'], synonyms: [], antonyms: [] },
  { id: 8, word: 'compost (n)', pronunciation: '/ˈkɒmpɒst/', meaning: 'phân hữu cơ', examples: ['You can make your own compost at home.'], synonyms: [], antonyms: [] },
  { id: 9, word: 'in the long run', pronunciation: '', meaning: 'về lâu dài', examples: ['This solution is not sustainable in the long run.'], synonyms: [], antonyms: [] },
  { id: 10, word: 'leftover (n)', pronunciation: '/ˈleftəʊvə(r)/', meaning: 'thức ăn thừa', examples: ['You\'ve always got good ideas for using up leftovers.'], synonyms: [], antonyms: [] },
  { id: 11, word: 'resource (n)', pronunciation: '/rɪˈsɔːs/', meaning: 'nguồn tài nguyên', examples: ['Water is a scarce resource in this part of the world.'], synonyms: [], antonyms: [] },
  { id: 12, word: 'single-use (adj)', pronunciation: '/ˌsɪŋɡl ˈjuːs/', meaning: 'dùng một lần', examples: ['Single-use products are bad for the environment.'], synonyms: [], antonyms: [] },
  { id: 13, word: 'rinse out', pronunciation: '', meaning: 'rửa sạch', examples: ['Rinse the cup out before use.'], synonyms: [], antonyms: [] },
  { id: 14, word: 'ecotourism (n)', pronunciation: '/ˈiːkəʊtʊərɪzəm/', meaning: 'du lịch sinh thái', examples: ['Ecotourism has become popular these days.'], synonyms: [], antonyms: [] },
  { id: 15, word: 'layer (n)', pronunciation: '/ˈleɪə(r)/', meaning: 'tầng, lớp', examples: ['How many layers of clothing are you wearing?'], synonyms: [], antonyms: [] },
  { id: 16, word: 'reusable (adj)', pronunciation: '/riːˈjuːzəbl/', meaning: 'có thể tái sử dụng', examples: ['This store deals in reusable plastic bottles.'], synonyms: [], antonyms: [] },
  { id: 17, word: 'contaminated (adj)', pronunciation: '/kənˈtæmɪneɪtɪd/', meaning: 'nhiễm độc, nhiễm khuẩn', examples: ['The drinking water has become contaminated with lead.'], synonyms: [], antonyms: [] },
  { id: 18, word: 'clean up', pronunciation: '', meaning: 'dọn dẹp', examples: ['Who\'s going to clean up this mess?'], synonyms: [], antonyms: [] },
  { id: 19, word: 'get rid of', pronunciation: '', meaning: 'loại bỏ', examples: ['He got rid of this old table.'], synonyms: [], antonyms: [] },
  { id: 20, word: 'carbon footprint (n)', pronunciation: '/ˌkɑːbən ˈfʊtprɪnt/', meaning: 'tổng lượng phát thải khí nhà kính', examples: ['Companies are measuring their carbon footprints.'], synonyms: [], antonyms: [] },
  { id: 21, word: 'pile (n)', pronunciation: '/paɪl/', meaning: 'đống', examples: ['I found it in a pile of documents on his desk.'], synonyms: [], antonyms: [] },
  { id: 22, word: 'sort (v)', pronunciation: '/sɔːt/', meaning: 'phân loại', examples: ['Rubbish can easily be separated and sorted into plastics, glass and paper.'], synonyms: [], antonyms: [] },
  { id: 23, word: 'release (v)', pronunciation: '/rɪˈliːs/', meaning: 'thải ra', examples: ['How much radiation was released into the air?'], synonyms: [], antonyms: [] },
];

const GREEN_LIVING_PART_2: Flashcard[] = [
    { id: 24, word: 'eco-friendly (adj)', pronunciation: '/ˌiːkəʊ ˈfrendli/', meaning: 'thân thiện/ tốt cho hệ sinh thái', examples: ['I sometimes buy eco-friendly products.'], synonyms: [], antonyms: [] },
    { id: 25, word: 'fruit peel (n)', pronunciation: '/fruːt piːl/', meaning: 'vỏ hoa quả', examples: ['Fruit peels can be used to make compost.'], synonyms: [], antonyms: [] },
    { id: 26, word: 'raise awareness', pronunciation: '', meaning: 'nâng cao nhận thức', examples: ["It's important to raise the public's awareness of the issue."], synonyms: [], antonyms: [] },
    { id: 27, word: 'recycle (v)', pronunciation: '/riːˈsaɪkl/', meaning: 'tái chế', examples: ['Denmark recycles nearly 85% of its paper.'], synonyms: [], antonyms: [] },
    { id: 28, word: 'in the long/medium/short term', pronunciation: '', meaning: 'về lâu dài/ trong thời gian không xa/ trong thời gian trước mắt', examples: ['In the long term, our efforts will pay off.'], synonyms: [], antonyms: [] },
    { id: 29, word: 'decompose (v)', pronunciation: '/ˌdiːkəmˈpəʊz/', meaning: 'phân huỷ', examples: ['Certain kinds of plastic decompose quickly.'], synonyms: [], antonyms: [] },
    { id: 30, word: 'reuse (v)', pronunciation: '/riːˈjuːz/', meaning: 'tái sử dụng', examples: ['Please reuse your envelopes.'], synonyms: [], antonyms: [] },
    { id: 31, word: 'cardboard (n/adj)', pronunciation: '/ˈkɑːdbɔːd/', meaning: 'bìa cứng, làm bằng bìa cứng', examples: ['I need a cardboard box to store these toys.'], synonyms: [], antonyms: [] },
    { id: 32, word: 'awareness (n)', pronunciation: '/əˈweənəs/', meaning: 'sự nhận thức', examples: ['Most people have little awareness of the problem.'], synonyms: [], antonyms: [] },
    { id: 33, word: 'household waste (n)', pronunciation: '/ˈhaʊshəʊld weɪst/', meaning: 'rác thải sinh hoạt', examples: ['Household waste are dumped improperly.'], synonyms: [], antonyms: [] },
    { id: 34, word: 'throw something away', pronunciation: '', meaning: 'vứt thứ gì đó', examples: ['That old chair should be thrown away.'], synonyms: [], antonyms: [] },
    { id: 35, word: 'waste (n)', pronunciation: '/weɪst/', meaning: 'rác thải', examples: ['Around four million tons of industrial waste are disposed of each year.'], synonyms: [], antonyms: [] },
    { id: 36, word: 'sustainable (adj)', pronunciation: '/səˈsteɪnəbl/', meaning: 'bền vững, thân thiện với môi trường', examples: ['This type of farming is simply not sustainable any more.'], synonyms: [], antonyms: [] },
    { id: 37, word: 'a waste of something', pronunciation: '', meaning: 'lãng phí thứ gì', examples: ['The whole thing has been a complete waste of time.'], synonyms: [], antonyms: [] },
    { id: 38, word: 'recyclable (adj)', pronunciation: '/riːˈsaɪkləbl/', meaning: 'có thể tái chế', examples: ['Glass products are completely recyclable.'], synonyms: [], antonyms: [] },
    { id: 39, word: 'efficiently (adv)', pronunciation: '/ɪˈfɪʃntli/', meaning: 'một cách hiệu quả', examples: ['Resources must be used efficiently to avoid waste.'], synonyms: [], antonyms: [] },
];

const GREEN_LIVING_PART_1_OBJ: VocabularyPart = { name: 'Green Living - Part 1', words: GREEN_LIVING_PART_1 };
const GREEN_LIVING_PART_2_OBJ: VocabularyPart = { name: 'Green Living - Part 2', words: GREEN_LIVING_PART_2 };

const UNIT_3_GREEN_LIVING: Unit = {
    name: 'Unit 3: Green Living',
    parts: [GREEN_LIVING_PART_1_OBJ, GREEN_LIVING_PART_2_OBJ]
};

// --- NEW: Urbanisation Vocabulary ---
const URBANISATION_PART_1: Flashcard[] = [
    { id: 40, word: 'resident (n)', pronunciation: '/ˈrezɪdənt/', meaning: 'người dân', examples: ['The local residents formed a committee to oppose the dump.'], synonyms: [], antonyms: [] },
    { id: 41, word: 'urban (adj)', pronunciation: '/ˈɜːbən/', meaning: 'thuộc về đô thị', examples: ['Air pollution has become serious in some urban areas.'], synonyms: [], antonyms: [] },
    { id: 42, word: 'leisure (n)', pronunciation: '/leʒə(r)/', meaning: 'sự giải trí, sự thư giãn', examples: ['Make the most of your leisure time!'], synonyms: [], antonyms: [] },
    { id: 43, word: 'convenience store (n)', pronunciation: '/kənˈviːniəns stɔː(r)/', meaning: 'cửa hàng tiện lợi', examples: ['We bought some snacks at the convenience store.'], synonyms: [], antonyms: [] },
    { id: 44, word: 'expand (v)', pronunciation: '/ɪkˈspænd/', meaning: 'mở rộng', examples: ['There are no plans to expand the local airport.'], synonyms: [], antonyms: [] },
    { id: 45, word: 'afford (v)', pronunciation: '/əˈfɔːd/', meaning: 'có đủ khả năng chi trả', examples: ["We can't afford to go abroad this summer."], synonyms: [], antonyms: [] },
    { id: 46, word: 'crowded (adj)', pronunciation: '/ˈkraʊdɪd/', meaning: 'đông đúc', examples: ['London was very crowded.'], synonyms: [], antonyms: [] },
    { id: 47, word: 'housing (n)', pronunciation: '/ˈhaʊzɪŋ/', meaning: 'nhà ở', examples: ['We must find a way to solve the city\'s housing crisis.'], synonyms: [], antonyms: [] },
    { id: 48, word: 'affordable (adj)', pronunciation: '/əˈfɔːdəbl/', meaning: '(giá cả) rẻ, phải chăng', examples: ['We offer quality products at affordable prices.'], synonyms: [], antonyms: [] },
    { id: 49, word: 'modernise (v)', pronunciation: '/ˈmɒdənaɪz/', meaning: 'hiện đại hoá', examples: ['The company is investing $9 million to modernise its factories.'], synonyms: [], antonyms: [] },
    { id: 50, word: 'urbanisation (n)', pronunciation: '/ˌɜːbənaɪˈzeɪʃn/', meaning: 'đô thị hoá', examples: ['Urbanisation can also cause problems.'], synonyms: [], antonyms: [] },
    { id: 51, word: 'convenient (adj)', pronunciation: '/kənˈviːniənt/', meaning: 'thuận tiện', examples: ['A bicycle is often more convenient than a car in towns.'], synonyms: [], antonyms: [] },
];

const URBANISATION_PART_2: Flashcard[] = [
    { id: 52, word: 'seek (v)', pronunciation: '/siːk/', meaning: 'tìm kiếm', examples: ['Police are seeking witnesses to the accident.'], synonyms: [], antonyms: [] },
    { id: 53, word: 'urban sprawl (n.p.)', pronunciation: '/ˌɜːbən ˈsprɔːl/', meaning: 'sự bành trướng đô thị', examples: ['They have made attempts to control the fast-growing urban sprawl.'], synonyms: [], antonyms: [] },
    { id: 54, word: 'reliable (adj)', pronunciation: '/rɪˈlaɪəbl/', meaning: 'đáng tin cậy', examples: ['Our information comes from a reliable source.'], synonyms: [], antonyms: [] },
    { id: 55, word: 'high-rise (adj)', pronunciation: '/ˈhaɪ raɪz/', meaning: 'cao tầng', examples: ['These high-rise apartment blocks were built in the 1960s.'], synonyms: [], antonyms: [] },
    { id: 56, word: 'gradually (adv)', pronunciation: '/ˈɡrædʒuəli/', meaning: 'dần dần', examples: ['The weather gradually improved.'], synonyms: [], antonyms: [] },
    { id: 57, word: 'colonial (adj)', pronunciation: '/kəˈləʊniəl/', meaning: 'thuộc địa, thuộc dân', examples: ['Tunisia achieved independence from French colonial rule in 1956.'], synonyms: [], antonyms: [] },
    { id: 58, word: 'concern (n)', pronunciation: '/kənˈsɜːn/', meaning: 'mối lo ngại', examples: ['Villagers expressed concern about the level of traffic.'], synonyms: [], antonyms: [] },
    { id: 59, word: 'rapidly (adv)', pronunciation: '/ˈræpɪdli/', meaning: 'rất nhanh, với tốc độ cao', examples: ['Crime figures are rising rapidly.'], synonyms: [], antonyms: [] },
    { id: 60, word: 'infrastructure (n)', pronunciation: '/ˈɪnfrəstrʌktʃə(r)/', meaning: 'cơ sở hạ tầng', examples: ["The war has badly damaged the country's infrastructure."], synonyms: [], antonyms: [] },
    { id: 61, word: 'unemployment (n)', pronunciation: '/ˌʌnɪmˈplɔɪmənt/', meaning: 'tình trạng thất nghiệp', examples: ['The unemployment rate rose to 4.7 per cent.'], synonyms: [], antonyms: [] },
    { id: 62, word: 'rush hour (n.p.)', pronunciation: '/ˈrʌʃ aʊə(r)/', meaning: 'giờ cao điểm', examples: ['The rush hour traffic was slow.'], synonyms: [], antonyms: [] },
];

const URBANISATION_PART_1_OBJ: VocabularyPart = { name: 'Urbanisation - Part 1', words: URBANISATION_PART_1 };
const URBANISATION_PART_2_OBJ: VocabularyPart = { name: 'Urbanisation - Part 2', words: URBANISATION_PART_2 };

const UNIT_4_URBANISATION: Unit = {
    name: 'Unit 4: Urbanisation',
    parts: [URBANISATION_PART_1_OBJ, URBANISATION_PART_2_OBJ]
};

// --- NEW: Artificial Intelligence Vocabulary ---
const AI_PART_1: Flashcard[] = [
  { id: 63, word: 'sustain (v)', pronunciation: "/sə'stein/", meaning: 'duy trì, hứng chịu (điều tiêu cực)', examples: ['She managed to sustain everyone\'s interest.'], synonyms: [], antonyms: [] },
  { id: 64, word: 'envisage (v)', pronunciation: "/in'vızıdz/", meaning: 'hình dung', examples: ['It is envisaged that building will start at the end of this year.'], synonyms: [], antonyms: [] },
  { id: 65, word: 'perceive (v)', pronunciation: "/pǝ'si:v/", meaning: 'nhận thức', examples: ['I perceived a change in his behaviour.'], synonyms: [], antonyms: [] },
  { id: 66, word: 'demonstrate (v)', pronunciation: "/'demənstreit/", meaning: 'minh họa, chứng minh', examples: ['The study demonstrates the link between poverty and malnutrition.'], synonyms: [], antonyms: [] },
  { id: 67, word: 'artificial intelligence (n)', pronunciation: "/ˌɑːtɪfɪʃl ɪnˈtelɪdʒəns/", meaning: 'trí tuệ nhân tạo', examples: ['Artificial intelligence is transforming many industries.'], synonyms: [], antonyms: [] },
  { id: 68, word: 'humanoid (adj)', pronunciation: "/'hju:mənəıd/", meaning: '(có hình dáng) hình người', examples: ['Robots with a humanoid appearance are becoming more common.'], synonyms: [], antonyms: [] },
  { id: 69, word: 'accommodate (v)', pronunciation: "/ə'kɒmədeit/", meaning: 'đáp ứng, cung cấp nơi ở', examples: ['The hotel can accommodate up to 500 guests.'], synonyms: [], antonyms: [] },
  { id: 70, word: 'satisfy (v)', pronunciation: "/'sætisfai/", meaning: 'thỏa mãn, làm hài lòng', examples: ['Nothing satisfies him—he\'s always complaining.'], synonyms: [], antonyms: [] },
  { id: 71, word: 'reveal (v)', pronunciation: "/ri'vi:l/", meaning: 'tiết lộ', examples: ['The survey reveals some interesting facts.'], synonyms: [], antonyms: [] },
  { id: 72, word: 'undertake (v)', pronunciation: "/ˌʌndəˈteik/", meaning: 'đảm nhận, thực hiện', examples: ['Students are required to undertake simple experiments.'], synonyms: [], antonyms: [] },
  { id: 73, word: 'natural disaster (np)', pronunciation: "/ˌnætʃrəl dɪˈzɑːstə(r)/", meaning: 'thiên tai', examples: ['Floods and earthquakes are natural disasters.'], synonyms: [], antonyms: [] },
  { id: 74, word: 'manual (adj)', pronunciation: "/'mænjuǝl/", meaning: 'thủ công (làm bằng tay)', examples: ['Manual labour is hard work.'], synonyms: [], antonyms: [] },
  { id: 75, word: 'unequal (adj)', pronunciation: "/ʌn'i:kwəl/", meaning: 'không công bằng, không bình đẳng', examples: ['The contest was unequal from the start.'], synonyms: [], antonyms: [] },
  { id: 76, word: 'worthy (adj)', pronunciation: "/'wɜːði/", meaning: 'xứng đáng', examples: ['A worthy champion.'], synonyms: [] },
  { id: 77, word: 'fortunate (adj)', pronunciation: "/'fɔːtʃənət/", meaning: 'may mắn', examples: ['I was fortunate enough to have a good education.'], synonyms: [], antonyms: [] },
  { id: 78, word: 'sophisticated (adj)', pronunciation: "/səˈfɪstɪkeɪtɪd/", meaning: 'tinh vi, phức tạp', examples: ['Highly sophisticated computer systems.'], synonyms: [], antonyms: [] },
  { id: 79, word: 'lay (v)', pronunciation: "/lei/", meaning: 'đặt, để (ngoại động từ)', examples: ['He laid the book on the table.'], synonyms: [], antonyms: [] },
  { id: 80, word: 'link (v)', pronunciation: "/lɪŋk/", meaning: 'liên kết', examples: ['The bridge links the two cities.'], synonyms: [], antonyms: [] },
  { id: 81, word: 'raise (v)', pronunciation: "/reiz/", meaning: 'làm tăng lên, dấy lên (ngoại động từ)', examples: ['They raised the price of fuel.'], synonyms: [], antonyms: [] },
  { id: 82, word: 'rise (v)', pronunciation: "/raiz/", meaning: 'tăng lên (nội động từ)', examples: ['The sun rises in the east.'], synonyms: [], antonyms: [] },
  { id: 83, word: 'gadget (n)', pronunciation: "/'gædʒɪt/", meaning: 'thiết bị, dụng cụ', examples: ['A new gadget for opening wine bottles.'], synonyms: [], antonyms: [] },
  { id: 84, word: 'advocate (v)', pronunciation: "/'ædvəkeit/", meaning: 'tán thành, ủng hộ', examples: ['The group does not advocate the use of violence.'], synonyms: [], antonyms: [] },
  { id: 85, word: 'eliminate (v)', pronunciation: "/i'limineit/", meaning: 'loại bỏ', examples: ['Credit cards eliminate the need to carry a lot of cash.'], synonyms: [], antonyms: [] },
  { id: 86, word: 'recognise (v)', pronunciation: "/'rekəgnaiz/", meaning: 'nhận ra, công nhận', examples: ['I recognised him as soon as he came in the room.'], synonyms: [], antonyms: [] },
  { id: 87, word: 'organise (v)', pronunciation: "/'ɔːgənaiz/", meaning: 'sắp xếp, tổ chức', examples: ['He helped to organise the party.'], synonyms: [], antonyms: [] },
  { id: 88, word: 'integrate (v)', pronunciation: "/'intigreit/", meaning: 'tích hợp', examples: ['The new features are integrated into the software.'], synonyms: [], antonyms: [] },
  { id: 89, word: 'simulate (v)', pronunciation: "/'simjuleit/", meaning: 'mô phỏng', examples: ['Computer software can simulate different conditions.'], synonyms: [], antonyms: [] },
  { id: 90, word: 'anticipate (v)', pronunciation: "/æn'tisipeit/", meaning: 'đoán trước, lường trước', examples: ['We anticipate that sales will rise next year.'], synonyms: [], antonyms: [] },
  { id: 91, word: 'exploit (v)', pronunciation: "/ik'splɔit/", meaning: 'khai thác, lợi dụng', examples: ['We need to make sure that we exploit our resources as fully as possible.'], synonyms: [], antonyms: [] },
];

const AI_PART_2: Flashcard[] = [
  { id: 92, word: 'stimulate (v)', pronunciation: "/'stɪmjuleɪt/", meaning: 'kích thích (sự phát triển, trí tưởng tượng)', examples: ['Reading stories stimulates the imagination.'], synonyms: [], antonyms: [] },
  { id: 93, word: 'imagination (n)', pronunciation: "/ɪˌmædʒɪ'neɪʃn/", meaning: 'trí tưởng tượng', examples: ['Use your imagination!'], synonyms: [], antonyms: [] },
  { id: 94, word: 'interact (v)', pronunciation: "/ˌɪntər'ækt/", meaning: 'tương tác', examples: ['Teachers interact with students.'], synonyms: [], antonyms: [] },
  { id: 95, word: 'elicit (v)', pronunciation: "/i'lɪsɪt/", meaning: 'gợi ra (thông tin, phản ứng)', examples: ['The question elicited a response.'], synonyms: [], antonyms: [] },
  { id: 96, word: 'exacerbate (v)', pronunciation: "/ɪg'zæsəbeɪt/", meaning: 'làm trầm trọng hơn (làm xấu đi)', examples: ['Stress exacerbates the pain.'], synonyms: [], antonyms: [] },
  { id: 97, word: 'customise (v)', pronunciation: "/'kʌstəmaɪz/", meaning: 'tùy chỉnh (theo yêu cầu cá nhân)', examples: ['You can customize the settings.'], synonyms: [], antonyms: [] },
  { id: 98, word: 'generate (v)', pronunciation: "/'dʒenəreɪt/", meaning: 'tạo ra', examples: ['The machine generates electricity.'], synonyms: [], antonyms: [] },
  { id: 99, word: 'novel (adj)', pronunciation: "/'nɒvl/", meaning: 'mới lạ', examples: ['A novel idea.'], synonyms: [], antonyms: [] },
  { id: 100, word: 'expert (n)', pronunciation: "/'ekspɜːt/", meaning: 'chuyên gia', examples: ['An expert in the field.'], synonyms: [], antonyms: [] },
  { id: 101, word: 'temporary (adj)', pronunciation: "/'temprəri/", meaning: 'tạm thời', examples: ['A temporary job.'], synonyms: [], antonyms: [] },
  { id: 102, word: 'moderate (adj)', pronunciation: "/'mɒdərət/", meaning: 'vừa phải, điều độ', examples: ['Moderate exercise is good.'], synonyms: [], antonyms: [] },
  { id: 103, word: 'satisfactory (adj)', pronunciation: "/ˌsætɪs'fæktəri/", meaning: 'thỏa đáng, đạt yêu cầu', examples: ['The result was satisfactory.'], synonyms: [], antonyms: [] },
  { id: 104, word: 'contradictory (adj)', pronunciation: "/ˌkɒntrə'dɪktəri/", meaning: 'mâu thuẫn, trái ngược', examples: ['Contradictory advice.'], synonyms: [], antonyms: [] },
  { id: 105, word: 'confide (v)', pronunciation: "/kən'faɪd/", meaning: 'tâm sự, giãi bày', examples: ['She confided in her friend.'], synonyms: [], antonyms: [] },
  { id: 106, word: 'conduct (v)', pronunciation: "/kən'dʌkt/", meaning: 'chỉ đạo, tiến hành', examples: ['Conduct a survey.'], synonyms: [], antonyms: [] },
  { id: 107, word: 'conclude (v)', pronunciation: "/kən'kluːd/", meaning: 'kết luận', examples: ['We concluded the meeting.'], synonyms: [], antonyms: [] },
  { id: 108, word: 'contain (v)', pronunciation: "/kən'teɪn/", meaning: 'chứa đựng, kìm nén', examples: ['The box contains books.'], synonyms: [], antonyms: [] },
  { id: 109, word: 'consultant (n)', pronunciation: "/kən'sʌltənt/", meaning: 'cố vấn', examples: ['A business consultant.'], synonyms: [], antonyms: [] },
  { id: 110, word: 'depict (v)', pronunciation: "/dɪ'pɪkt/", meaning: 'miêu tả (thường qua hình ảnh/nghệ thuật)', examples: ['The painting depicts a battle.'], synonyms: [], antonyms: [] },
  { id: 111, word: 'describe (v)', pronunciation: "/dɪ'skraɪb/", meaning: 'miêu tả (bằng lời nói/văn viết)', examples: ['Describe the picture.'], synonyms: [], antonyms: [] },
  { id: 112, word: 'conceal (v)', pronunciation: "/kən'siːl/", meaning: 'che giấu', examples: ['He concealed the truth.'], synonyms: [], antonyms: [] },
  { id: 113, word: 'express (v)', pronunciation: "/ɪk'spres/", meaning: 'thể hiện (cảm xúc, ý kiến)', examples: ['Express your feelings.'], synonyms: [], antonyms: [] },
  { id: 114, word: 'notoriety (n)', pronunciation: "/ˌnəʊtə'raɪəti/", meaning: 'sự tai tiếng (nổi tiếng vì điều xấu)', examples: ['He gained notoriety for his crimes.'], synonyms: [], antonyms: [] },
  { id: 115, word: 'prevalence (n)', pronunciation: "/'prevələns/", meaning: 'sự phổ biến, thịnh hành', examples: ['The prevalence of the disease.'], synonyms: [], antonyms: [] },
  { id: 116, word: 'formation (n)', pronunciation: "/fɔː'meɪʃn/", meaning: 'sự hình thành', examples: ['Cloud formation.'], synonyms: [], antonyms: [] },
  { id: 117, word: 'definition (n)', pronunciation: "/ˌdefɪ'nɪʃn/", meaning: 'định nghĩa', examples: ['Look up the definition.'], synonyms: [], antonyms: [] },
];

const AI_PART_1_OBJ: VocabularyPart = { name: '1. Tổng quan về AI & Tác động xã hội', words: AI_PART_1 };
const AI_PART_2_OBJ: VocabularyPart = { name: '2. Ứng dụng & Lợi ích trong Giáo dục/Đời sống', words: AI_PART_2 };

const UNIT_6_AI: Unit = {
    name: 'Unit 6: Artificial Intelligence',
    parts: [AI_PART_1_OBJ, AI_PART_2_OBJ]
};


const GRADE_12: Grade = {
    name: 'Lớp 12',
    units: [UNIT_3_GREEN_LIVING, UNIT_4_URBANISATION, UNIT_6_AI]
};

const GRADE_11: Grade = { name: 'Lớp 11', units: [] };
const GRADE_10: Grade = { name: 'Lớp 10', units: [] };

export const CLASSROOMS: Classroom[] = [{
    name: 'Lớp học',
    description: 'Sách giáo khoa Tiếng Anh',
    grades: [GRADE_10, GRADE_11, GRADE_12]
}];


export const ALL_VOCABULARY = [
    ...GREEN_LIVING_PART_1,
    ...GREEN_LIVING_PART_2,
    ...URBANISATION_PART_1,
    ...URBANISATION_PART_2,
    ...AI_PART_1,
    ...AI_PART_2
];


// ==========================================
// NGỮ PHÁP 12 THÌ (THE 12 TENSES)
// ==========================================

const TENSE_PRESENT_SIMPLE: GrammarTopic = {
    id: 'present-simple',
    title: '1. Thì Hiện Tại Đơn',
    summary: 'Diễn tả thói quen, sự thật hiển nhiên hoặc lịch trình cố định.',
    colorTheme: 'blue',
    cheatSheet: {
        headers: ['Loại câu', 'Công thức', 'Ví dụ'],
        rows: [
            ['Khẳng định (+)', 'S + V(s/es) + O', 'He plays soccer.'],
            ['Phủ định (-)', 'S + do/does + not + V_inf', 'He doesn\'t play soccer.'],
            ['Nghi vấn (?)', 'Do/Does + S + V_inf?', 'Does he play soccer?'],
            ['To Be', 'Am / Is / Are', 'I am a student.']
        ]
    },
    sections: [
        {
            title: '1. Cách dùng chi tiết',
            content: '• **Thói quen hằng ngày:** I get up at 6 AM.\n• **Sự thật hiển nhiên:** The sun rises in the East.\n• **Lịch trình cố định (tàu xe, giờ học):** The train leaves at 7 PM.\n• **Cảm xúc, trạng thái:** I think, she feels, he loves.',
            examples: []
        },
        {
            title: '2. Dấu hiệu nhận biết',
            content: '• Trạng từ chỉ tần suất: Always, usually, often, sometimes, rarely, never.\n• Cụm từ thời gian: Every day/week/month, once a week, twice a month...',
            examples: ['She **always** drinks coffee in the morning.', 'We go to the cinema **once a month**.']
        },
        {
            title: '3. Quy tắc thêm s/es',
            content: '• Thêm **-es** khi động từ tận cùng là: o, s, x, z, ch, sh (Ông Sáu Xuống Zườn Chọn Sh).\n  Ex: go → goes, watch → watches.\n• Tận cùng là **y**: Đổi y → i rồi thêm es (nếu trước y là phụ âm).\n  Ex: study → studies.\n• Còn lại: Thêm **s**.',
            examples: []
        }
    ]
};

const TENSE_PRESENT_CONTINUOUS: GrammarTopic = {
    id: 'present-continuous',
    title: '2. Thì Hiện Tại Tiếp Diễn',
    summary: 'Diễn tả hành động đang xảy ra ngay lúc nói.',
    colorTheme: 'sky',
    cheatSheet: {
        headers: ['Loại câu', 'Công thức', 'Ví dụ'],
        rows: [
            ['(+)', 'S + am/is/are + V-ing', 'I am studying now.'],
            ['(-)', 'S + am/is/are + not + V-ing', 'She is not cooking.'],
            ['(?)', 'Am/Is/Are + S + V-ing?', 'Are you sleeping?']
        ]
    },
    sections: [
        {
            title: '1. Cách dùng chi tiết',
            content: '• **Hành động đang xảy ra:** I am typing right now.\n• **Hành động tạm thời:** I am living in Hanoi (but usually I live in Hue).\n• **Kế hoạch tương lai gần (đã định sẵn):** We are meeting him tonight.\n• **Phàn nàn (với "always"):** He is always coming late!',
            examples: []
        },
        {
            title: '2. Dấu hiệu nhận biết',
            content: '• Now, right now, at the moment, at present.\n• Câu mệnh lệnh: Look!, Listen!, Be quiet!',
            examples: ['**Listen!** The birds are singing.', 'She is working **at the moment**.']
        }
    ]
};

const TENSE_PRESENT_PERFECT: GrammarTopic = {
    id: 'present-perfect',
    title: '4. Thì Hiện Tại Hoàn Thành',
    summary: 'Hành động đã xảy ra nhưng không rõ thời gian, hoặc bắt đầu trong quá khứ kéo dài đến hiện tại.',
    colorTheme: 'cyan',
    cheatSheet: {
        headers: ['Loại câu', 'Công thức', 'Ví dụ'],
        rows: [
            ['(+)', 'S + have/has + V3/ed', 'I have seen this movie.'],
            ['(-)', 'S + have/has + not + V3/ed', 'She hasn\'t finished.'],
            ['(?)', 'Have/Has + S + V3/ed?', 'Have you eaten yet?']
        ]
    },
    sections: [
        {
            title: '1. Cách dùng chi tiết',
            content: '• **Hành động vừa mới xảy ra:** I have just eaten.\n• **Hành động lặp lại nhiều lần:** I have watched this film 3 times.\n• **Bắt đầu quá khứ, kéo dài hiện tại:** We have lived here for 10 years.',
            examples: []
        },
        {
            title: '2. Dấu hiệu nhận biết',
            content: '• Just, already, yet, since, for, so far...',
            examples: ['I haven\'t met him **since** 2010.']
        }
    ]
};

const TENSE_PAST_SIMPLE: GrammarTopic = {
    id: 'past-simple',
    title: '3. Thì Quá Khứ Đơn',
    summary: 'Hành động đã xảy ra và chấm dứt hoàn toàn trong quá khứ.',
    colorTheme: 'emerald',
    cheatSheet: {
        headers: ['Loại câu', 'Công thức', 'Ví dụ'],
        rows: [
            ['(+)', 'S + V2/ed', 'I visited Hue yesterday.'],
            ['(-)', 'S + did + not + V_inf', 'I didn\'t go out.'],
            ['(?)', 'Did + S + V_inf?', 'Did you see him?']
        ]
    },
    sections: [
        {
            title: '1. Cách dùng chi tiết',
            content: '• **Hành động đã xong tại thời điểm xác định:** I bought a car in 2020.',
            examples: []
        },
        {
            title: '2. Dấu hiệu nhận biết',
            content: '• Yesterday, last night, ago, in 1990.',
            examples: ['We met **last summer**.']
        }
    ]
};

const TENSE_FUTURE_SIMPLE: GrammarTopic = {
    id: 'future-simple',
    title: '5. Thì Tương Lai Đơn',
    summary: 'Quyết định ngay lúc nói, dự đoán không căn cứ.',
    colorTheme: 'amber',
    cheatSheet: {
        headers: ['Loại câu', 'Công thức', 'Ví dụ'],
        rows: [
            ['(+)', 'S + will + V_inf', 'I will help you.'],
            ['(-)', 'S + will + not + V_inf', 'I won\'t go.'],
            ['(?)', 'Will + S + V_inf?', 'Will you marry me?']
        ]
    },
    sections: [
        {
            title: '1. Cách dùng chi tiết',
            content: '• **Quyết định tức thì:** I\'m thirsty. I will buy water.',
            examples: []
        }
    ]
};

// --- MERGED TOPIC ---
const COMMON_TENSES: GrammarTopic = {
    id: 'common-tenses',
    title: '5 Thì Thông Dụng',
    summary: 'Tổng hợp 5 thì cơ bản và quan trọng nhất: Hiện tại đơn, Tiếp diễn, Hoàn thành, Quá khứ đơn và Tương lai đơn.',
    colorTheme: 'blue',
    subTopics: [
        TENSE_PRESENT_SIMPLE,
        TENSE_PRESENT_CONTINUOUS,
        TENSE_PRESENT_PERFECT,
        TENSE_PAST_SIMPLE,
        TENSE_FUTURE_SIMPLE
    ],
    sections: [
        {
            title: 'Tầm quan trọng',
            content: 'Đây là 5 thì nền tảng chiếm hơn 80% cấu trúc trong giao tiếp và đề thi THPT Quốc gia.',
            examples: []
        }
    ]
};

// --- OTHER TOPICS ---
const GRAMMAR_TOPIC_QUESTIONS: GrammarTopic = {
    id: 'questions-and-wh',
    title: 'Chuyên đề: Câu hỏi & Từ để hỏi',
    summary: 'Tổng hợp cách đặt câu hỏi Wh-questions, Yes/No questions và cách phân biệt What/Which.',
    colorTheme: 'purple',
    cheatSheet: {
        headers: ['Từ để hỏi', 'Ý nghĩa', 'Ví dụ'],
        rows: [
            ['**Who**', 'Ai (Chủ ngữ/Tân ngữ)', 'Who is he?'],
            ['**What**', 'Cái gì, Hành động gì', 'What is this?'],
            ['**Which**', 'Cái nào (Lựa chọn)', 'Which pen do you want?'],
            ['**Where**', 'Ở đâu (Nơi chốn)', 'Where do you live?'],
            ['**When**', 'Khi nào (Thời gian)', 'When does the class start?'],
            ['**Why**', 'Tại sao (Lý do)', 'Why are you sad?'],
            ['**How**', 'Như thế nào (Cách thức)', 'How do you go to school?']
        ]
    },
    sections: [
        {
            title: '1. Câu hỏi có từ để hỏi (Wh-Questions)',
            content: '• **Cấu trúc:** Wh-word + Trợ động từ (do/does/did/is/are...) + S + V?\n• **Lưu ý:** Nếu từ để hỏi đóng vai trò là Chủ ngữ (Subject), ta không mượn trợ động từ (Ví dụ: Who wants ice cream?).',
            examples: ['**What** did you buy yesterday?', '**Where** are they going?', '**Who** wrote this book?']
        },
        {
            title: '2. Phân biệt "What" và "Which"',
            content: '• **What:** Dùng khi hỏi về một thông tin chung chung, không giới hạn phạm vi câu trả lời.\n• **Which:** Dùng khi người hỏi đưa ra một số lựa chọn cụ thể (giới hạn) để người nghe chọn.',
            examples: [
                '**What** music do you like? (Nhạc gì cũng được: Pop, Rock, Jazz...)',
                '**Which** do you prefer: Tea or Coffee? (Chỉ chọn giữa Trà hoặc Cà phê)'
            ]
        },
        {
            title: '3. Các dạng mở rộng của "How"',
            content: '• **How much:** Hỏi giá tiền hoặc lượng (danh từ không đếm được).\n• **How many:** Hỏi số lượng (danh từ đếm được).\n• **How long:** Hỏi về độ dài (thời gian/kích thước).\n• **How far:** Hỏi về khoảng cách.\n• **How often:** Hỏi về mức độ thường xuyên.',
            examples: ['**How much** is this shirt?', '**How often** do you swim?']
        },
        {
            title: '4. Câu hỏi nghi vấn (Yes/No Questions)',
            content: '• **Cấu trúc:** Trợ động từ (Be/Do/Have/Modals) + S + V?\n• **Trả lời:** Yes, S + Aux. / No, S + Aux + not.',
            examples: ['**Are** you a student? - Yes, I am.', '**Do** you like cats? - No, I don\'t.']
        }
    ]
};

// --- NEW TOPIC: MODAL VERBS ---
const GRAMMAR_TOPIC_MODAL_VERBS: GrammarTopic = {
    id: 'modal-verbs',
    title: 'Động từ khuyết thiếu (Modal Verbs)',
    summary: 'Can, Could, Must, Should, May, Might... Cách dùng và phân biệt.',
    colorTheme: 'teal',
    cheatSheet: {
        headers: ['Modal Verb', 'Ý nghĩa', 'Ví dụ'],
        rows: [
            ['**Can / Could**', 'Khả năng / Năng lực', 'I can swim.'],
            ['**Must**', 'Phải (Bắt buộc chủ quan)', 'I must study.'],
            ['**Have to**', 'Phải (Bắt buộc khách quan)', 'I have to wear uniforms.'],
            ['**Should**', 'Nên (Lời khuyên)', 'You should sleep early.'],
            ['**May / Might**', 'Có lẽ (Dự đoán < 50%)', 'It may rain today.']
        ]
    },
    sections: [
        {
            title: '1. Đặc điểm chung',
            content: '• Luôn đi với động từ nguyên thể (V-infinitive).\n• Không thêm **s/es** (ngôi thứ 3 số ít).\n• Không dùng trợ động từ (do/does) trong câu hỏi/phủ định.\n• **Cấu trúc:** S + Modal + V_inf.',
            examples: ['He **can speak** English. (NOT: He cans speak...)', '**Should** I go now?']
        },
        {
            title: '2. Chỉ khả năng (Ability)',
            content: '• **Can:** Khả năng ở hiện tại.\n• **Could:** Khả năng trong quá khứ.\n• **Be able to:** Dùng được cho mọi thì (tương lai, hoàn thành...), nhấn mạnh khả năng xoay sở trong tình huống cụ thể.',
            examples: ['I **can** play guitar.', 'She **could** read when she was 4.', 'I haven\'t **been able to** sleep lately.']
        },
        {
            title: '3. Sự bắt buộc (Obligation)',
            content: '• **Must:** Bắt buộc từ phía người nói (chủ quan), hoặc luật lệ văn bản.\n• **Have to:** Bắt buộc do hoàn cảnh bên ngoài (nội quy, tình thế).\n\n**Lưu ý quan trọng:**\n• **Mustn\'t:** Cấm đoán (Không được phép).\n• **Don\'t have to:** Không cần phải làm (Không bắt buộc).',
            examples: ['I **must** finish this report (Tôi tự thấy cần làm).', 'Students **have to** wear uniforms (Nội quy trường).', 'You **mustn\'t** smoke here (Cấm).', 'You **don\'t have to** hurry (Không cần vội).']
        },
        {
            title: '4. Lời khuyên (Advice)',
            content: '• **Should / Ought to:** Khuyên ai đó nên làm gì.\n• **Had better:** Tốt hơn hết là nên làm gì (mang tính cảnh báo mạnh hơn).',
            examples: ['You **should** see a doctor.', 'You **had better** go now or you will be late.']
        },
        {
            title: '5. Dự đoán (Probability)',
            content: 'Sắp xếp theo độ chắc chắn giảm dần:\n• **Must be:** Chắc chắn là (90% - có căn cứ).\n• **Should be:** Chắc là (70% - theo lẽ thường).\n• **May / Might / Could:** Có lẽ là (30-50% - không chắc chắn).\n• **Can\'t be:** Chắc chắn không phải là.',
            examples: ['He has a Ferrari. He **must be** rich.', 'It **might** rain tonight.', 'That **can\'t be** Tom, he is in Paris.']
        }
    ]
};

// --- NEW TOPIC: CONJUNCTIONS ---
const GRAMMAR_TOPIC_CONJUNCTIONS: GrammarTopic = {
    id: 'basic-conjunctions',
    title: 'Liên từ cơ bản (Conjunctions)',
    summary: 'Cách dùng 5 liên từ phổ biến nhất: And, But, So, Or, Because.',
    colorTheme: 'lime',
    cheatSheet: {
        headers: ['Liên từ', 'Ý nghĩa', 'Ví dụ'],
        rows: [
            ['**And**', 'Và (Thêm ý)', 'I like coffee **and** tea.'],
            ['**But**', 'Nhưng (Đối lập)', 'She is poor **but** happy.'],
            ['**So**', 'Nên/Vì vậy (Kết quả)', 'It rained, **so** I stayed home.'],
            ['**Or**', 'Hoặc (Lựa chọn)', 'Do you want tea **or** coffee?'],
            ['**Because**', 'Bởi vì (Nguyên nhân)', 'I stayed home **because** it rained.']
        ]
    },
    sections: [
        {
            title: '1. And (Và)',
            content: '• **Chức năng:** Dùng để nối hai từ, hai cụm từ hoặc hai mệnh đề có cùng vai trò ngữ pháp và ý nghĩa tương đương (bổ sung cho nhau).\n• **Ví dụ:** I like cats **and** dogs.',
            examples: ['He is tall **and** handsome.', 'She can sing **and** dance.']
        },
        {
            title: '2. But (Nhưng)',
            content: '• **Chức năng:** Dùng để nối hai ý trái ngược nhau.\n• **Lưu ý:** Thường đứng giữa câu, trước đó có thể có dấu phẩy.\n• **Ví dụ:** I studied hard, **but** I failed.',
            examples: ['The car is old, **but** it runs well.', 'I want to go, **but** I have no money.']
        },
        {
            title: '3. So (Vì vậy, cho nên)',
            content: '• **Chức năng:** Dùng để chỉ kết quả của hành động trước đó.\n• **Cấu trúc:** [Nguyên nhân], so [Kết quả].\n• **Lưu ý:** Thường có dấu phẩy đứng trước "so" khi nối hai mệnh đề.\n• **QUAN TRỌNG:** Trong tiếng Anh, không dùng "Because" và "So" trong cùng một câu (chỉ chọn một trong hai).',
            examples: ['He was tired, **so** he went to bed early.', 'It was raining, **so** we cancelled the picnic.']
        },
        {
            title: '4. Or (Hoặc)',
            content: '• **Chức năng:** Dùng để đưa ra sự lựa chọn giữa hai hay nhiều khả năng.\n• **Ví dụ:** You can go **or** stay.',
            examples: ['Would you like tea **or** coffee?', 'Hurry up **or** you will be late.']
        },
        {
            title: '5. Because (Bởi vì)',
            content: '• **Chức năng:** Dùng để giải thích nguyên nhân, lý do.\n• **Cấu trúc:** Because + Mệnh đề (S + V).\n• **Lưu ý:** Mệnh đề chứa "Because" có thể đứng đầu hoặc cuối câu. Nếu đứng đầu câu, phải có dấu phẩy ngăn cách với mệnh đề chính.\n• **QUAN TRỌNG:** Không dùng chung với "So".',
            examples: ['I passed the exam **because** I studied hard.', '**Because** it was raining, we stayed at home.']
        }
    ]
};

// --- NEW TOPIC: ARTICLES & DETERMINERS ---
const GRAMMAR_TOPIC_ARTICLES_DETERMINERS: GrammarTopic = {
    id: 'articles-determiners',
    title: 'Mạo từ & Từ chỉ định',
    summary: 'Quy tắc dùng A/An/The, Trường hợp không dùng mạo từ và cách dùng This/That.',
    colorTheme: 'orange',
    cheatSheet: {
        headers: ['Từ', 'Cách dùng chính', 'Ví dụ'],
        rows: [
            ['**A / An**', 'Số ít, nhắc lần đầu', 'A dog, An hour'],
            ['**The**', 'Xác định, duy nhất, so sánh nhất', 'The Sun, The best'],
            ['**Zero (Ø)**', 'Bữa ăn, tên đường, tháng', 'Breakfast, May'],
            ['**This/These**', 'Gần (Số ít/Số nhiều)', 'This book, These books'],
            ['**That/Those**', 'Xa (Số ít/Số nhiều)', 'That car, Those cars']
        ]
    },
    sections: [
        {
            title: '1. Mạo từ không xác định (A / An)',
            content: 'Dùng trước danh từ đếm được số ít khi vật đó chưa được xác định hoặc được nhắc đến lần đầu.\n\n**Quy tắc phát âm:**\n• **A**: Đứng trước danh từ bắt đầu bằng phụ âm.\n  *Lưu ý:* Phụ thuộc vào **phiên âm**, không phải chữ cái.\n  Ví dụ: a boy, a university (/ju:/ - bán nguyên âm).\n• **An**: Đứng trước danh từ bắt đầu bằng nguyên âm (u, e, o, a, i).\n  Ví dụ: an apple, an hour (h câm), an MA (/em/ - nguyên âm e).',
            examples: [
                'Subaru set out on **an** amazing adventure.',
                'They helped him buy **a** boat.',
                'She wants to study at **a** university (vì phát âm là /ju:/).'
            ]
        },
        {
            title: '2. Mạo từ xác định (The)',
            content: 'Dùng cho cả danh từ số ít và số nhiều khi đối tượng đã được xác định.\n\n**Các trường hợp phổ biến:**\n• **Nhắc lại lần 2:** I saw a cat. **The** cat was cute.\n• **Vật duy nhất:** The Sun, The Earth, The Moon, The sky.\n• **So sánh nhất:** The most beautiful, The best.\n• **The + Tính từ (chỉ nhóm người):** The poor (người nghèo), The homeless, The rich.\n• **Tên nước (số nhiều hoặc có từ Kingdom/States/Republic):** The UK, The US, The Netherlands, The Philippines.\n• **Các tổ chức, truyền thông:** The internet, The press, The world.',
            examples: [
                'One of **the best** ideas is holding a festival.',
                'We help **the homeless** in our city.',
                'Research shows that **the UK** drives on the left.'
            ]
        },
        {
            title: '3. Không dùng mạo từ (Zero Article)',
            content: 'Không dùng a/an/the trong các trường hợp sau:\n• **Tên đường, hồ, núi (số ít):** Wall Street, Lake Baikal, Mount Everest.\n• **Bữa ăn:** have breakfast, have lunch, have dinner.\n• **Tháng, năm:** in May, in 2024.\n• **Cụm từ cố định (chỉ mục đích chính):** go to bed (đi ngủ), go to school (đi học), go to work.',
            examples: [
                'I usually have **breakfast** at 7 AM.',
                'They go to **school** by bus.',
                'See you in **July**.'
            ]
        },
        {
            title: '4. Từ chỉ định (This / That / These / Those)',
            content: 'Dùng để chỉ định đối tượng dựa trên khoảng cách (không gian/thời gian) và số lượng.\n\n**a. Phân loại:**\n• **This:** Số ít - Ở gần (This book).\n• **That:** Số ít - Ở xa (That car).\n• **These:** Số nhiều - Ở gần (These books).\n• **Those:** Số nhiều - Ở xa (Those cars).\n\n**b. Chức năng:**\n• **Đại từ (Đứng một mình):** Thay thế cho danh từ. VD: **That** was amazing.\n• **Từ hạn định (Đứng trước danh từ):** Bổ nghĩa cho danh từ. VD: **This** problem is hard.',
            examples: [
                '**This** problem is complicated.',
                'I didn\'t know **that** word.',
                '**These** children are my cousins.',
                'Adam found a gold coin. **That** was amazing.'
            ]
        }
    ]
};

export const GRAMMAR_CATEGORIES: GrammarCategory[] = [
  {
    id: 'cat-basic',
    name: 'Ngữ pháp Cơ bản',
    description: 'Nắm vững các thì quan trọng nhất trong tiếng Anh.',
    topics: [
        COMMON_TENSES 
    ]
  },
  {
      id: 'cat-topics',
      name: 'Các Chuyên đề Ngữ pháp',
      description: 'Câu hỏi, Động từ khuyết thiếu, Liên từ, Mạo từ...',
      topics: [
          GRAMMAR_TOPIC_ARTICLES_DETERMINERS,
          GRAMMAR_TOPIC_CONJUNCTIONS,
          GRAMMAR_TOPIC_QUESTIONS,
          GRAMMAR_TOPIC_MODAL_VERBS
      ]
  }
];

export const CATEGORIES: VocabularyCategory[] = [
    UNIT_3_GREEN_LIVING
];
