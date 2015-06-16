doubleMe x = x + x
doubleUs x y = x*2 + y*2
doubleSmallNumber x = if x > 100 then x else x * 2
doubleSmallNumber' x = (if x > 100 then x else x * 2) + 1
--boomBangs [7..13]   ["BOOM!","BOOM!","BANG!","BANG!"] 
boomBangs xs = [ if x < 10 then "BOOM!" else "BANG!" | x <- xs, odd x]

-- 实现一个与length函数一样的函数length'

length' xs = sum [1 | _ <- xs]


-- remove non upper case
removeNonUpperCase st = [c | c <- st, c `elem` ['A'..'Z']]


factorial :: Integer -> Integer
factorial n = product [1..n]



-- pattern matching
factoriala :: (Integral a) => a -> a
factoriala 0 = 1
factoriala n = n * factoriala(n - 1)


-- 利用pattern  x:xs 实现 head
head' :: [a] -> a
head' [] = error "Can't call head on an empty list, dummy!"
head' (x:_) = x


-- 更加复杂的例子

tell :: (Show a) => [a] -> String  
tell [] = "The list is empty"  
tell (x:[]) = "The list has one element: " ++ show x  
tell (x:y:[]) = "The list has two elements: " ++ show x ++ " and " ++ show y  
tell (x:y:_) = "This list is long. The first two elements are: " ++ show x ++ " and " ++ show y  

-- 递归实现的length

length'' :: (Num b) => [a] -> b
length'' [] = 0
length'' (_:xs) = 1 + length' xs

-- sum
sum' :: (Num a) => [a] -> a  
sum' [] = 0  
sum' (x:xs) = x + sum' xs  


-- max

max' :: (Ord a) => a -> a -> a
max' a b
    | a > b = a
    | otherwise = b


-- compare

myCompare :: (Ord a) => a -> a -> Ordering
a `myCompare` b
    | a > b = GT
    | a == b = EQ
    | otherwise = LT

-- 一个不错的例子，用来讲解Guard
bmiTell :: (RealFloat a) => a -> a -> String
bmiTell weight height
    | bmi <= skinny = "You're underweight, you emo, you!"
    | bmi <= normal = "You're supposedly normal. Pffft, I bet you're ugly!"
    | bmi <= fat    = "You're fat! Lose some weight, fatty!"
    | otherwise     = "You're a whale, congratulations!"
    where bmi = weight / height ^ 2
          skinny = 18.5
          normal = 25.0
          fat = 30.0

-- 另外一个例子，讲解了如何对参数进行处理，例如这里去除string的第一个字母
initials :: String -> String -> String
initials firstname lastname = [f] ++ ". " ++ [l] ++ "."
    where (f:_) = firstname
          (l:_) = lastname


-- let <binding> in <Expression>
cylinder :: (RealFloat a) => a -> a -> a  
cylinder r h = 
    let sideArea = 2 * pi * r * h  
        topArea = pi * r ^2  
    in  sideArea + 2 * topArea


-- 递归 maximum
maximum' :: (Ord a) => [a] -> a
maximum' [] = error "maximum of empty list"  
maximum' [x] = x  
maximum' (x:xs)   
    | x > maxTail = x  
    | otherwise = maxTail  
    where maxTail = maximum' xs  

-- 使用max来简化 maximum 的逻辑
maximum'' :: (Ord a) => [a] -> a
maximum'' [] = error "maximum of empty list"
maximum'' [x] = x
maximum'' (x:xs) = max x (maximum' xs)

-- replicate
replicate' :: (Num i, Ord i) => i -> a -> [a]
replicate' n x
    | n <= 0    = []
    | otherwise = x:replicate' (n-1) x

--take
take' :: (Num i, Ord i) => i -> [a] -> [a]
take' n _
    | n <= 0   = []
take' _ []     = []
take' n (x:xs) = x : take' (n-1) xs

reverse' :: [a] -> [a]
reverse' [] = []
reverse' (x:xs) = reverse' xs ++ [x]

repeat' :: a -> [a]
repeat' x = x:repeat' x


zip' :: [a] -> [b] -> [(a,b)]
zip' [] _ = []
zip' _ [] = []
zip' (x:xs) (y:ys) = (x, y):zip' xs ys


elem'' :: (Eq a) => a -> [a] -> Bool
elem'' _ [] = False
elem'' a (x:xs)
    | a == x = True
    | otherwise = a `elem''` xs

-- 快速排序  使用list comprehensions
quicksort :: (Ord a) => [a] -> [a]
quicksort [] = []
quicksort (x:xs) =
    let smallerSorted = quicksort [a | a <- xs, a <= x]
        biggerSorted = quicksort [a | a <-xs, a > x]
    in  smallerSorted ++ [x] ++ biggerSorted

-- fibonacci 版本1 使用pattern match
fibonacci ::Int -> Int
fibonacci 0 = 0
fibonacci 1 = 1
fibonacci n = fibonacci (n - 1) + fibonacci (n - 2)


-- fibonacci 版本2 使用 guards
fib :: Integer -> Integer
fib n
    | n == 0  = 0
    | n == 1  = 1
    | n > 1   = fib (n-1) + fib (n-2)


multThree :: (Num a) => a -> a -> a -> a
multThree x y z = x * y * z


applyTwice :: (a -> a) -> a -> a
applyTwice f x = f (f x)

zipwith' :: (a -> b -> c) -> [a] -> [b] -> [c]
zipwith' _ [] _ = []
zipwith' _ _ [] = []
zipwith' f (x:xs) (y:ys) = f x y : zipwith' f xs ys


flip' :: (a -> b -> c) -> b -> a -> c  
flip' f y x = f x y  


-- 快速排序，利用filter
quicksort :: (Ord a) => [a] -> [a]
quicksort [] = []
quicksort (x:xs) =
    let smallerSorted = quicksort (filter (<=x) xs)
        biggerSorted = quicksort (filter (>x) xs)
    in  smallerSorted ++ [x] ++ biggerSorted