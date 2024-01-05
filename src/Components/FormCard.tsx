type FormCardType = {
     title: string,
     children?: JSX.Element,
}
export default function FormCard({ children, title }: FormCardType) {
     return (
          <details id="personaldetails" className="rounded-lg shadow-xl" open>
               <summary className="text-xl font-bold tracking-wide text-blue-500 bg-blue-200 p-5 rounded-lg">{title}</summary>
               {children}
          </details>
     )
}
