
export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <div className="auth-logo">
        <h1>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur aperiam in aliquam perferendis atque! Architecto adipisci et quae inventore voluptatem commodi deserunt unde facere, in repellat porro natus debitis? Ratione! Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore ratione debitis, reiciendis necessitatibus fugiat non soluta voluptate assumenda veniam consequuntur corrupti aperiam hic obcaecati, temporibus sed laborum eveniet totam alias! Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate nemo fugiat, sapiente nihil magnam nulla velit atque excepturi iure hic in quasi, cum officia asperiores nesciunt fuga commodi esse laborum.
        Iusto tempore ipsum deserunt tempora aliquid distinctio est, maxime rem. Reprehenderit dolorum maiores iure sit saepe commodi, ipsum at vitae architecto totam sapiente minima. Molestiae magni enim maiores aspernatur vitae.
        Totam ab, error incidunt quaerat laboriosam at esse nesciunt ipsa rerum nemo, in adipisci! Provident voluptatem debitis, labore incidunt sapiente aliquam, sit repellendus nulla nisi esse unde rem, maiores perferendis.
        At ducimus voluptatem nesciunt in iure mollitia corporis commodi ipsa id deserunt? Fuga explicabo aliquid id nisi ut tenetur, laboriosam aut dicta, quia sit quasi! Provident sed itaque officia tempore.</h1>
      </div>
      <main className="auth-content">
        {children}
        </main>
    </div>
  );
}